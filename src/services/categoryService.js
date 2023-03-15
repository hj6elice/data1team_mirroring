import { categoryModel } from "../db";

class CategoryService {
  constructor(CategoryModel) {
    this.categoryModel = CategoryModel;
    this.addCategory = this.addCategory.bind(this);
    this.getCategories = this.getCategories.bind(this);
    this.getCategory = this.getCategory.bind(this);
    this.setCategory = this.setCategory.bind(this);
    this.deleteCategory = this.deleteCategory.bind(this);
  }

  async addCategory(categoryInfo) {
    const { title } = categoryInfo;

    const found = await this.categoryModel.findByTitle(title);
    if (found) {
      throw new Error(`이미 존재하는 카테고리입니다.`);
    }

    const createdNewCategory = await this.categoryModel.create(categoryInfo);
    return createdNewCategory;
  }

  async getCategories() {
    const categories = await this.categoryModel.findAll();
    return categories;
  }

  async getCategory(categoryId) {
    const category = await this.categoryModel.findById(categoryId);
    if (!category) {
      throw new Error(`해당 카테고리가 존재하지 않습니다.`);
    }
    return category;
  }

  async setCategory(categoryId, title) {
    const category = await this.categoryModel.findByTitle(title);
    if (category) {
      if (category.id !== categoryId) {
        throw new Error(`같은 이름의 카테고리가 이미 존재합니다.`);
      }
    }
    const { matchedCount, modifiedCount } = await this.categoryModel.updateById(
      categoryId,
      title,
    );

    if (matchedCount === 0) {
      throw new Error(`해당 카테고리가 존재하지 않습니다.`);
    }

    let result = `수정이 완료 되었습니다.`;
    if (modifiedCount === 0) {
      result = `수정된 내용이 없습니다.`;
    }
    return result;
  }

  async deleteCategory(categoryId) {
    // ++해당 카테고리에 속한 post 있으면 삭제 불가하게 추가 처리 필요

    const { deletedCount } = await this.categoryModel.deleteById(categoryId);
    if (deletedCount === 0) {
      throw new Error(`카테고리 삭제에 실패했습니다.`);
    }
    return { result: `카테고리 삭제를 완료하였습니다.` };
  }
}

const categoryService = new CategoryService(categoryModel);

export { categoryService };
