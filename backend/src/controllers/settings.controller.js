import settingsService from '../services/settings.service.js';

export const getSection = async (req, res, next) => {
  try {
    const { section } = req.params;
    const settings = await settingsService.getSettings(section);
    res.json(settings);
  } catch (error) {
    next(error);
  }
};

export const updateSection = async (req, res, next) => {
  try {
    const { section } = req.params;
    const content = req.body;
    const updated = await settingsService.updateSettings(section, content);
    res.json(updated.content);
  } catch (error) {
    next(error);
  }
};

export const getPublic = async (req, res, next) => {
  try {
    const settings = await settingsService.getPublicSettings();
    res.json(settings);
  } catch (error) {
    next(error);
  }
};

export default {
  getSection,
  updateSection,
  getPublic,
};
