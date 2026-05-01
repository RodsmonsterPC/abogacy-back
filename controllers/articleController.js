const Article = require('../models/Article');

// @desc  Get all published articles (public) or all articles (admin)
// @route GET /api/articles
// @access Public
const getArticles = async (req, res) => {
  try {
    const { category, page = 1, limit = 9, search, all } = req.query;
    const query = {};

    // Only show published articles unless admin requests all
    if (!all) {
      query.published = true;
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Article.countDocuments(query);
    const articles = await Article.find(query)
      .populate('author', 'name')
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-content');

    res.json({
      articles,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get single article by slug or id
// @route GET /api/articles/:id
// @access Public
const getArticle = async (req, res) => {
  try {
    const article = await Article.findOne({
      $or: [{ slug: req.params.id }, { _id: req.params.id.match(/^[a-f\d]{24}$/i) ? req.params.id : null }],
    }).populate('author', 'name');

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    // Increment views
    article.views += 1;
    await article.save({ validateBeforeSave: false });

    res.json(article);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Create article
// @route POST /api/articles
// @access Private
const createArticle = async (req, res) => {
  try {
    const article = await Article.create({
      ...req.body,
      author: req.user._id,
    });
    res.status(201).json(article);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc  Update article
// @route PUT /api/articles/:id
// @access Private
const updateArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!article) return res.status(404).json({ message: 'Article not found' });
    res.json(article);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc  Delete article
// @route DELETE /api/articles/:id
// @access Private
const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) return res.status(404).json({ message: 'Article not found' });
    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getArticles, getArticle, createArticle, updateArticle, deleteArticle };
