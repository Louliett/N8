"use strict"

export class Product {

  constructor (
    name, price, new_price, ean, quantity, brand, design, image_link, description,
    material, colour, length, width, height, volume, weight, subcategory, category, section) {

      this.name = name;
      this.price = price;
      this.new_price = new_price;
      this.ean = ean;
      this.quantity = quantity;
      this.brand = brand;
      this.design = design;
      this.image_link = image_link;
      this.description = description;
      this.material = material;
      this.colour = colour;
      this.length = length;
      this.width = width;
      this.height = height;
      this.volume = volume;
      this.weight = weight;
      this.subcategory = subcategory;
      this.category = category;
      this.section = section;

  }

  //constructor() {}

  test() {
    return "Test successful!"
  }
  // Getters
  getName() {
      return this.name;
  }

  getPrice() {
      return this.price;
  }

  getNewPrice() {
      return this.new_price;
  }

  getEan() {
      return this.ean;
  }

  getQuantity() {
      return this.quantity;
  }

  getBrand() {
      return this.brand;
  }

  getDesign() {
      return this.design;
  }

  getImageLink() {
      return this.image_link;
  }

  getDescription() {
      return this.description;
  }

  getMaterial() {
      return this.material;
  }

  getColour() {
      return this.colour;
  }

  getLength() {
      return this.length;
  }

  getWidth() {
      return this.width;
  }

  getHeight() {
      return this.height;
  }

  getVolume() {
      return this.volume;
  }

  getWeight() {
      return this.weight;
  }

  getSubcategory() {
      return this.subcategory;
  }

  getCategory() {
      return this.category;
  }

  getSection() {
      return this.section;
  }

  // Setters

  setName(newName) {
      this.name = newName;
    }

  setPrice(newPrice) {
      this.price = newPrice;
    }

  setNewPrice(newNewPrice) {
    this.new_price = newNewPrice;
  }

  setEan(newEan) {
    this.ean = newEan;
  }

  setQuantity(newQuantity) {
    this.quantity = newQuantity;
  }

  setBrand(newBrand) {
    this.brand = newBrand;
  }

  setDesign(newDesign) {
    this.design = newDesign;
  }

  setImageLink(newImageLink) {
    this.image_link = newImageLink;
  }

  setDescription(newDescription) {
    this.description = newDescription;
  }

  setMaterial(newMaterial) {
    this.material = newMaterial;
  }

  setColour(newColour) {
    this.colour = newColour;
  }

  setLength(newLength) {
    this.length = newLength;
  }

  setWidth(newWidth) {
    this.width = newWidth;
  }

  setHeight(newHeight) {
    this.height = newHeight;
  }

  setVolume(newVolume) {
    this.volume = newVolume;
  }

  setWeight(newWeight) {
    this.weight = newWeight;
  }

  setSubcategory(newSubcategory) {
    this.subcategory = newSubcategory;
  }

  setCategoryId(newCategory) {
    this.category = newCategory;
  }

  setSection(newSection) {
    this.section = newSection;
  }

}

//module.exports = Product
