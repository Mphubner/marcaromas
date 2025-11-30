import { PrismaClient } from '@prisma/client';
import slugify from 'slugify';

const prisma = new PrismaClient();

async function migrateBlogPosts() {
    try {
        console.log('🔄 Starting blog post migration...\n');

        // Check if old blog_posts table exists
        // Note: Prisma might not have the model definition if it was removed, 
        // so we use raw query to check existence and fetch data.
        const tableExists = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'BlogPost'
      );
    `;

        if (!tableExists[0]?.exists) {
            console.log('ℹ️ No BlogPost table found. Checking for blog_posts...');
            const tableExistsSnake = await prisma.$queryRaw`
        SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_name = 'blog_posts'
        );
        `;
            if (!tableExistsSnake[0]?.exists) {
                console.log('ℹ️ No blog_posts table found either. Nothing to migrate.');
                return;
            }
        }

        // Get old posts (try both naming conventions if needed, or just assume one based on previous schema)
        // Based on previous schema view, it was 'BlogPost' model, which usually maps to 'BlogPost' or 'blog_posts' depending on mapping.
        // Let's try to select from BlogPost first.

        let oldPosts = [];
        try {
            oldPosts = await prisma.$queryRaw`SELECT * FROM "BlogPost"`;
        } catch (e) {
            try {
                oldPosts = await prisma.$queryRaw`SELECT * FROM blog_posts`;
            } catch (e2) {
                console.log('Could not query old posts table.');
                return;
            }
        }

        console.log(`📊 Found ${oldPosts.length} posts to migrate\n`);

        let migratedCount = 0;

        for (const post of oldPosts) {
            try {
                // Generate unique slug
                let slug = slugify(post.title, { lower: true, strict: true });
                let counter = 1;

                while (await prisma.content.findUnique({ where: { slug } })) {
                    slug = `${slugify(post.title, { lower: true, strict: true })}-${counter}`;
                    counter++;
                }

                // Create content
                const content = await prisma.content.create({
                    data: {
                        title: post.title,
                        slug,
                        excerpt: post.excerpt || '',
                        cover_image: post.cover_image || '',
                        type: 'BLOG_POST',
                        category: post.category || 'aromatherapy',
                        tags: post.tags || [],
                        status: post.is_published ? 'PUBLISHED' : 'DRAFT',
                        publish_date: post.publish_date || post.createdAt,
                        seo_title: post.seo_title || post.title,
                        seo_description: post.seo_description || post.excerpt || '',
                        // seo_keywords not in old model usually, but we can try tags
                        seo_keywords: post.tags || [],
                        blocks: {
                            create: [
                                {
                                    type: 'TEXT',
                                    order: 0,
                                    data: {
                                        html: post.content || '<p>Content migrated from old system</p>',
                                        alignment: 'left'
                                    },
                                    is_visible: true
                                }
                            ]
                        }
                    }
                });

                migratedCount++;
                console.log(`✅ Migrated: "${content.title}" → ${content.slug}`);

            } catch (error) {
                console.error(`❌ Failed to migrate post "${post.title}":`, error.message);
            }
        }

        console.log(`\n✨ Migration complete! ${migratedCount}/${oldPosts.length} posts migrated.`);

    } catch (error) {
        console.error('❌ Migration failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

// Run migration
migrateBlogPosts();
