import { PrismaClient } from '@prisma/client';
import slugify from 'slugify';

const prisma = new PrismaClient();

// ============================================
// PUBLIC ENDPOINTS
// ============================================

/**
 * GET /api/content
 * List published content (blog + exclusive)
 */
export const getAllContent = async (req, res) => {
  try {
    const { type, category, limit = 50, offset = 0 } = req.query;

    const where = {
      status: 'PUBLISHED',
      publish_date: { lte: new Date() }
    };

    if (type) where.type = type;
    if (category) where.category = category;

    const content = await prisma.content.findMany({
      where,
      include: {
        author: {
          select: { id: true, name: true }
        },
        _count: {
          select: { blocks: true }
        }
      },
      orderBy: { publish_date: 'desc' },
      take: parseInt(limit),
      skip: parseInt(offset)
    });

    const total = await prisma.content.count({ where });

    res.json({
      content,
      total,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * GET /api/content/:slug
 * Get content by slug (with blocks)
 */
export const getContentBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const content = await prisma.content.findUnique({
      where: { slug },
      include: {
        author: {
          select: { id: true, name: true }
        },
        blocks: {
          where: { is_visible: true },
          orderBy: { order: 'asc' }
        }
      }
    });

    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }

    // Check if published (for public access)
    if (content.status !== 'PUBLISHED' || (content.publish_date && content.publish_date > new Date())) {
      return res.status(404).json({ error: 'Content not found' });
    }

    // Increment view count
    await prisma.content.update({
      where: { id: content.id },
      data: { views: { increment: 1 } }
    });

    res.json(content);

  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * GET /api/content/category/:category
 * Filter content by category
 */
export const getContentByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    const where = {
      status: 'PUBLISHED',
      publish_date: { lte: new Date() },
      category
    };

    const content = await prisma.content.findMany({
      where,
      include: {
        author: {
          select: { id: true, name: true }
        }
      },
      orderBy: { publish_date: 'desc' },
      take: parseInt(limit),
      skip: parseInt(offset)
    });

    const total = await prisma.content.count({ where });

    res.json({
      content,
      category,
      total,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

  } catch (error) {
    console.error('Error fetching content by category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ============================================
// ADMIN ENDPOINTS
// ============================================

/**
 * GET /api/admin/content
 * List all content (drafts + published)
 */
export const getAllContentAdmin = async (req, res) => {
  try {
    const { status, type, limit = 100, offset = 0 } = req.query;

    const where = {};
    if (status) where.status = status;
    if (type) where.type = type;

    const content = await prisma.content.findMany({
      where,
      include: {
        author: {
          select: { id: true, name: true }
        },
        _count: {
          select: { blocks: true }
        }
      },
      orderBy: { updated_at: 'desc' },
      take: parseInt(limit),
      skip: parseInt(offset)
    });

    const total = await prisma.content.count({ where });

    res.json({
      content,
      total,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

  } catch (error) {
    console.error('Error fetching content (admin):', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * GET /api/admin/content/:id
 * Get content by ID (for editing)
 */
export const getContentById = async (req, res) => {
  try {
    const { id } = req.params;

    const content = await prisma.content.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, name: true }
        },
        blocks: {
          orderBy: { order: 'asc' }
        }
      }
    });

    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }

    res.json(content);

  } catch (error) {
    console.error('Error fetching content by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * POST /api/admin/content
 * Create new content
 */
export const createContent = async (req, res) => {
  try {
    const {
      title,
      excerpt,
      cover_image,
      type,
      category,
      tags = [],
      required_plan_ids = [],
      seo_title,
      seo_description,
      seo_keywords = [],
      blocks = []
    } = req.body;

    // Validation
    if (!title || !type) {
      return res.status(400).json({ error: 'Title and type are required' });
    }

    // Generate slug
    const baseSlug = slugify(title, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 1;

    // Ensure unique slug
    while (await prisma.content.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Create content with blocks
    const content = await prisma.content.create({
      data: {
        title,
        slug,
        excerpt,
        cover_image,
        type,
        category,
        tags,
        required_plan_ids,
        seo_title,
        seo_description,
        seo_keywords,
        published_by_id: req.user?.id,
        blocks: {
          create: blocks.map((block, index) => ({
            order: index,
            type: block.type,
            data: block.data,
            is_visible: block.is_visible !== undefined ? block.is_visible : true
          }))
        }
      },
      include: {
        blocks: {
          orderBy: { order: 'asc' }
        }
      }
    });

    res.status(201).json(content);

  } catch (error) {
    console.error('Error creating content:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * PUT /api/admin/content/:id
 * Update content
 */
export const updateContent = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      excerpt,
      cover_image,
      category,
      tags,
      required_plan_ids,
      seo_title,
      seo_description,
      seo_keywords,
      read_time_minutes
    } = req.body;

    // Update slug if title changed
    let updateData = {
      title,
      excerpt,
      cover_image,
      category,
      tags,
      required_plan_ids,
      seo_title,
      seo_description,
      seo_keywords,
      read_time_minutes
    };

    // If title changed, regenerate slug
    if (title) {
      const existingContent = await prisma.content.findUnique({
        where: { id },
        select: { title: true, slug: true }
      });

      if (existingContent && existingContent.title !== title) {
        const baseSlug = slugify(title, { lower: true, strict: true });
        let slug = baseSlug;
        let counter = 1;

        while (await prisma.content.findFirst({
          where: {
            slug,
            NOT: { id }
          }
        })) {
          slug = `${baseSlug}-${counter}`;
          counter++;
        }

        updateData.slug = slug;
      }
    }

    const content = await prisma.content.update({
      where: { id },
      data: updateData,
      include: {
        blocks: {
          orderBy: { order: 'asc' }
        }
      }
    });

    res.json(content);

  } catch (error) {
    console.error('Error updating content:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * DELETE /api/admin/content/:id
 * Delete content (cascades to blocks)
 */
export const deleteContent = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.content.delete({
      where: { id }
    });

    res.json({ success: true });

  } catch (error) {
    console.error('Error deleting content:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * POST /api/admin/content/:id/publish
 * Publish draft
 */
export const publishContent = async (req, res) => {
  try {
    const { id } = req.params;

    const content = await prisma.content.update({
      where: { id },
      data: {
        status: 'PUBLISHED',
        publish_date: new Date()
      }
    });

    res.json(content);

  } catch (error) {
    console.error('Error publishing content:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * POST /api/admin/content/:id/unpublish
 * Unpublish content
 */
export const unpublishContent = async (req, res) => {
  try {
    const { id } = req.params;

    const content = await prisma.content.update({
      where: { id },
      data: {
        status: 'DRAFT'
      }
    });

    res.json(content);

  } catch (error) {
    console.error('Error unpublishing content:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * GET /api/content/:id/access
 * Check if user has access to content
 */
export const checkAccess = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const content = await prisma.content.findUnique({
      where: { id },
      select: { required_plan_ids: true, type: true, status: true }
    });

    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }

    // Must be published
    if (content.status !== 'PUBLISHED') {
      return res.json({ hasAccess: false, reason: 'NOT_PUBLISHED' });
    }

    // Public content (no plans required)
    if (!content.required_plan_ids || content.required_plan_ids.length === 0) {
      return res.json({ hasAccess: true });
    }

    // Must be logged in for exclusive content
    if (!userId) {
      return res.json({ hasAccess: false, reason: 'NOT_LOGGED_IN' });
    }

    // Check user's active subscriptions
    const activeSubs = await prisma.subscription.findMany({
      where: { user_id: userId, status: 'ACTIVE' },
      select: { plan_id: true }
    });

    const userPlanIds = activeSubs.map(sub => sub.plan_id);
    const hasAccess = content.required_plan_ids.some(planId =>
      userPlanIds.includes(planId)
    );

    res.json({
      hasAccess,
      required_plan_ids: content.required_plan_ids,
      user_plan_ids: userPlanIds,
      reason: hasAccess ? null : 'MISSING_PLAN'
    });

  } catch (error) {
    console.error('Error checking access:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * POST /api/content/:id/view
 * Increment view count (with deduplication)
 */
export const incrementViews = async (req, res) => {
  try {
    const { id } = req.params;
    const userIP = req.ip || req.connection.remoteAddress;
    const userId = req.user?.id;

    // Create unique key for deduplication (IP or user ID)
    const viewKey = userId ? `user_${userId}` : `ip_${userIP}`;

    // Simple in-memory deduplication (24h window)
    // In production, use Redis: await redis.get(`view:${id}:${viewKey}`)
    // For now, just increment (can add Redis later)

    await prisma.content.update({
      where: { id },
      data: { views: { increment: 1 } }
    });

    res.sendStatus(204);

  } catch (error) {
    console.error('Error incrementing views:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * GET /api/content/search?q=keyword&type=BLOG_POST&limit=20
 * Search content with full-text matching
 */
export const searchContent = async (req, res) => {
  try {
    const { q, type, limit = 20, offset = 0 } = req.query;

    if (!q || q.trim().length === 0) {
      return res.status(400).json({ error: 'Query parameter "q" is required' });
    }

    const searchTerm = q.trim();

    // Build where clause
    const where = {
      status: 'PUBLISHED',
      ...(type && { type }),
      OR: [
        { title: { contains: searchTerm, mode: 'insensitive' } },
        { excerpt: { contains: searchTerm, mode: 'insensitive' } },
        { tags: { has: searchTerm } },
        { seo_keywords: { has: searchTerm } }
      ]
    };

    // Get results with author
    const results = await prisma.content.findMany({
      where,
      include: {
        author: {
          select: { id: true, name: true }
        },
        _count: {
          select: { blocks: true }
        }
      },
      orderBy: [
        { views: 'desc' },        // Most viewed first
        { publish_date: 'desc' }  // Then most recent
      ],
      take: parseInt(limit),
      skip: parseInt(offset)
    });

    // Get total count for pagination
    const total = await prisma.content.count({ where });

    res.json({
      results,
      query: searchTerm,
      count: results.length,
      total,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

  } catch (error) {
    console.error('Error searching content:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
