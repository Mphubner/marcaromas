import { prisma } from '../lib/prisma.js';

// Listar todos os produtos disponíveis (público)
export const getAllProducts = async (req, res, next) => {
  try {
    const products = await prisma.product.findMany({
      where: { is_available: true },
      include: { variants: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(products);
  } catch (error) {
    next(error);
  }
};

// (Admin) List all products including unavailable - for admin UI
export const getAllProductsAdmin = async (req, res, next) => {
  try {
    const products = await prisma.product.findMany({
      include: { variants: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(products);
  } catch (error) {
    next(error);
  }
};

// (Admin) Get a product by ID (ignore is_available) - used by admin edit pages
export const getProductByIdAdmin = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { variants: true },
    });

    if (!product) return res.status(404).json({ message: 'Produto não encontrado.' });

    res.json(product);
  } catch (error) {
    next(error);
  }
};

// Buscar um produto pelo slug
export const getProductBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const product = await prisma.product.findUnique({
      where: { slug },
      include: { variants: true },
    });

    if (!product || !product.is_available) {
      return res.status(404).json({ message: 'Produto não encontrado.' });
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
};

// Buscar produtos em destaque
export const getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await prisma.product.findMany({
      where: { is_available: true, is_featured: true },
      include: { variants: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(products);
  } catch (error) {
    next(error);
  }
};

// Buscar produtos por categoria
export const getProductsByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const products = await prisma.product.findMany({
      where: { is_available: true, category },
      include: { variants: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(products);
  } catch (error) {
    next(error);
  }
};

// Buscar produtos por texto
export const searchProducts = async (req, res, next) => {
  try {
    const { q } = req.query;
    const products = await prisma.product.findMany({
      where: {
        is_available: true,
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { short_description: { contains: q, mode: 'insensitive' } },
          { tags: { has: q.toLowerCase() } },
        ],
      },
      include: { variants: true },
    });
    res.json(products);
  } catch (error) {
    next(error);
  }
};

// Listar todas as categorias
export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await prisma.product.findMany({
      where: { is_available: true },
      distinct: ['category'],
      select: { category: true },
    });
    res.json(categories.map(c => c.category).filter(Boolean)); // Filtra nulos/vazios
  } catch (error) {
    next(error);
  }
};

// (Admin) Criar um novo produto - validações básicas e suporte a variants/images/tags
export const createProduct = async (req, res, next) => {
  try {
    const payload = req.body || {};
    const {
      name,
      slug,
      price,
      images,
      short_description,
      description,
      compare_at_price,
      stock_quantity,
      is_featured,
      is_available = true,
      category,
      aroma_family,
      aroma_notes = [],
      size,
      burn_time,
      ingredients = [],
      tags = [],
      variants = [],
    } = payload;

    // Required fields similar to a marketplace
    if (!name || !slug || typeof price === 'undefined') {
      return res.status(400).json({ message: 'Campos obrigatórios: name, slug, price' });
    }

    if (!Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ message: 'Pelo menos uma imagem é necessária (campo images).' });
    }

    // Normalize tags/notes
    const normalizedTags = Array.isArray(tags) ? tags.map(t => String(t).toLowerCase()) : [];

    const createData = {
      name,
      slug,
      price: Number(price),
      images: images.map(String),
      seo_title: payload.seo_title || null,
      seo_description: payload.seo_description || null,
      short_description: short_description || null,
      description: description || null,
      compare_at_price: compare_at_price ? Number(compare_at_price) : undefined,
      stock_quantity: stock_quantity ? Number(stock_quantity) : 0,
      is_featured: !!is_featured,
      is_available: !!is_available,
      category: category || null,
      aroma_family: aroma_family || null,
      aroma_notes: Array.isArray(aroma_notes) ? aroma_notes.map(String) : [],
      size: size || null,
      burn_time: burn_time || null,
      weight: payload.weight ? Number(payload.weight) : undefined,
      length: payload.length ? Number(payload.length) : undefined,
      width: payload.width ? Number(payload.width) : undefined,
      height: payload.height ? Number(payload.height) : undefined,
      inventory_policy: payload.inventory_policy || null,
      ingredients: Array.isArray(ingredients) ? ingredients.map(String) : [],
      tags: normalizedTags,
      variants: {
        create: Array.isArray(variants)
          ? variants.map(v => ({
            variant_name: v.variant_name || v.name || 'Variante',
            price: v.price ? Number(v.price) : Number(price),
            inventory_qty: v.inventory_qty ? Number(v.inventory_qty) : 0,
          }))
          : [],
      },
    };

    const newProduct = await prisma.product.create({ data: createData, include: { variants: true } });
    res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
};


// (Admin) Atualizar um produto - suporta atualização de imagens, variants e campos avançados
export const updateProduct = async (req, res, next) => {
  const { productId } = req.params;
  const payload = req.body || {};
  try {
    // Build update data
    const updateData = {};
    const updatableFields = [
      'name',
      'slug',
      'price',
      'seo_title',
      'seo_description',
      'short_description',
      'description',
      'compare_at_price',
      'stock_quantity',
      'is_featured',
      'is_available',
      'category',
      'aroma_family',
      'aroma_notes',
      'size',
      'burn_time',
      'weight',
      'length',
      'width',
      'height',
      'inventory_policy',
      'size',
      'burn_time',
      'ingredients',
      'tags',
      'images',
    ];

    updatableFields.forEach((f) => {
      if (typeof payload[f] !== 'undefined') updateData[f] = payload[f];
    });

    // If variants provided, replace existing variants in a transaction
    let result;
    if (Array.isArray(payload.variants)) {
      result = await prisma.$transaction(async (tx) => {
        // Update product
        const prod = await tx.product.update({ where: { id: productId }, data: updateData });

        // Delete existing variants and create new ones
        await tx.productVariant.deleteMany({ where: { productId } });
        if (payload.variants.length > 0) {
          const createMany = payload.variants.map(v => ({
            productId,
            variant_name: v.variant_name || v.name || 'Variante',
            price: v.price ? Number(v.price) : prod.price,
            inventory_qty: v.inventory_qty ? Number(v.inventory_qty) : 0,
          }));
          await tx.productVariant.createMany({ data: createMany });
        }

        const updated = await tx.product.findUnique({ where: { id: productId }, include: { variants: true } });
        return updated;
      });
    } else {
      result = await prisma.product.update({ where: { id: productId }, data: updateData, include: { variants: true } });
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
};

// (Admin) Deletar um produto
export const deleteProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    await prisma.product.delete({
      where: { id: productId },
    });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// (Admin) Bulk delete products
export const bulkDeleteProducts = async (req, res, next) => {
  try {
    const { productIds } = req.body;
    if (!Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({ message: 'productIds array required' });
    }

    await prisma.product.deleteMany({
      where: { id: { in: productIds } },
    });

    res.json({ message: `${productIds.length} produtos deletados com sucesso` });
  } catch (error) {
    next(error);
  }
};

// (Admin) Bulk update availability
export const bulkUpdateAvailability = async (req, res, next) => {
  try {
    const { productIds, is_available } = req.body;
    if (!Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({ message: 'productIds array required' });
    }

    await prisma.product.updateMany({
      where: { id: { in: productIds } },
      data: { is_available: !!is_available },
    });

    res.json({ message: `${productIds.length} produtos atualizados` });
  } catch (error) {
    next(error);
  }
};

// (Admin) Bulk update featured status
export const bulkUpdateFeatured = async (req, res, next) => {
  try {
    const { productIds, is_featured } = req.body;
    if (!Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({ message: 'productIds array required' });
    }

    await prisma.product.updateMany({
      where: { id: { in: productIds } },
      data: { is_featured: !!is_featured },
    });

    res.json({ message: `${productIds.length} produtos atualizados` });
  } catch (error) {
    next(error);
  }
};

