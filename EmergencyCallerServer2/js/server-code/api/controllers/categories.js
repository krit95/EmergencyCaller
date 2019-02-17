const mongoose = require("mongoose");

const Category = require("../models/category");
const Whitelist = require("../models/whitelist");
const Category_PP = require("../models/category_pp");
const Category_SLTFR = require("../models/category_sltfr");

const ItemsController = require('../controllers/items');

// Handle incoming GET requests for RGE to /categories
exports.categories_get_all = (req, res, next) => {
  Whitelist.find()
    .exec()
    .then(docs => {
      res.status(200).json({
        count: docs.length,
        whitelist: docs.map(doc => {
          return {
            phone_no: doc.phone_no,
            whitelist: doc.whitelist,
          };
        })
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};

exports.categories_create_category = (req, res, next) => {
  const isActive = true;
  if(req.body.is_active != "true") isActive = false;
  const category = new Category({
    _id: new mongoose.Types.ObjectId(),
    category_name: req.body.category_name,
    is_active: isActive
  });
  category
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Created category successfully",
        createdCategory: {
          category_name: result.category_name,
          is_active: result.is_active,
          _id: result._id,
          request: {
            type: 'GET',
            url: "http://localhost:3000/categories/" + result._id
          }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.categories_edit_category = (req, res, next) => {
  const id = req.params.categoryId;
  const updateOps = {};
  updateOps["category_name"]  = req.body.category_name;
  updateOps["is_active"]  = req.body.is_active;
  // for (const ops of req.body.updateOps) {
  //   updateOps[ops.propName] = ops.value;
  // }
  Category.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Category updated',
        request: {
          type: 'GET',
          url: 'http://localhost:3000/categories/' + id
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.categories_get_category = (req, res, next) => {
  console.log("req params: " + req.query.items);
  console.log("req params: " + req.params.categoryId);
  Category.findById(req.params.categoryId)
    .exec()
    .then(category => {
      if (!category) {
        return res.status(404).json({
          message: "Category not found"
        });
      }
      if(req.query.items && req.query.items == 'true'){
        ItemsController.items_get_by_category(req.params.categoryId).then(items => {
          res.status(200).json({
            category: category,
            items: items,
            request: {
              type: "GET",
              url: "http://localhost:3000/categories"
            }
          });
        });
      }else{
        res.status(200).json({
          category: category,
          request: {
            type: "GET",
            url: "http://localhost:3000/categories"
          }
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};

exports.categories_delete_category = (req, res, next) => {
  Category.remove({ _id: req.params.categoryId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Category deleted"
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};


// Handle incoming GET requests for PP to /categories
exports.categories_get_all_pp = (req, res, next) => {
  Category_PP.find()
    .select("category_name _id")
    .exec()
    .then(docs => {
      res.status(200).json({
        count: docs.length,
        categories: docs.map(doc => {
          return {
            _id: doc._id,
            category_name: doc.category_name,
            request: {
              type: "GET",
              url: "http://localhost:3000/categories/" + doc._id
            }
          };
        })
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};

exports.categories_create_category_pp = (req, res, next) => {
  const isActive = true;
  if(req.body.is_active != "true") isActive = false;
  const category_pp = new Category_PP({
    _id: new mongoose.Types.ObjectId(),
    category_name: req.body.category_name,
    is_active: isActive
  });
  category_pp
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Created category successfully",
        createdCategory: {
          category_name: result.category_name,
          is_active: result.is_active,
          _id: result._id,
          request: {
            type: 'GET',
            url: "http://localhost:3000/categories/" + result._id
          }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.categories_edit_category_pp = (req, res, next) => {
  const id = req.params.categoryId;
  const updateOps = {};
  updateOps["category_name"]  = req.body.category_name;
  updateOps["is_active"]  = req.body.is_active;
  // for (const ops of req.body.updateOps) {
  //   updateOps[ops.propName] = ops.value;
  // }
  Category_PP.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Category updated',
        request: {
          type: 'GET',
          url: 'http://localhost:3000/categories/' + id
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.categories_get_category_pp = (req, res, next) => {
  console.log("req params: " + req.query.items);
  console.log("req params: " + req.params.categoryId);
  Category_PP.findById(req.params.categoryId)
    .exec()
    .then(category => {
      if (!category) {
        return res.status(404).json({
          message: "Category not found"
        });
      }
      if(req.query.items && req.query.items == 'true'){
        ItemsController.items_get_by_category_pp(req.params.categoryId).then(items => {
          res.status(200).json({
            category: category,
            items: items,
            request: {
              type: "GET",
              url: "http://localhost:3000/categories"
            }
          });
        });
      }else{
        res.status(200).json({
          category: category,
          request: {
            type: "GET",
            url: "http://localhost:3000/categories"
          }
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};

exports.categories_delete_category_pp = (req, res, next) => {
  Category_PP.remove({ _id: req.params.categoryId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Category deleted"
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};


// Handle incoming GET requests for SLTFR to /categories
exports.categories_get_all_sltfr = (req, res, next) => {
  Category_SLTFR.find()
    .select("category_name _id")
    .exec()
    .then(docs => {
      res.status(200).json({
        count: docs.length,
        categories: docs.map(doc => {
          return {
            _id: doc._id,
            category_name: doc.category_name,
            request: {
              type: "GET",
              url: "http://localhost:3000/categories/" + doc._id
            }
          };
        })
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};

exports.categories_create_category_sltfr = (req, res, next) => {
  const isActive = true;
  if(req.body.is_active != "true") isActive = false;
  const category_sltfr = new Category_SLTFR({
    _id: new mongoose.Types.ObjectId(),
    category_name: req.body.category_name,
    is_active: isActive
  });
  category_sltfr
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Created category successfully",
        createdCategory: {
          category_name: result.category_name,
          is_active: result.is_active,
          _id: result._id,
          request: {
            type: 'GET',
            url: "http://localhost:3000/categories/" + result._id
          }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.categories_edit_category_sltfr = (req, res, next) => {
  const id = req.params.categoryId;
  const updateOps = {};
  updateOps["category_name"]  = req.body.category_name;
  updateOps["is_active"]  = req.body.is_active;
  // for (const ops of req.body.updateOps) {
  //   updateOps[ops.propName] = ops.value;
  // }
  Category_SLTFR.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Category updated',
        request: {
          type: 'GET',
          url: 'http://localhost:3000/categories/' + id
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.categories_get_category_sltfr = (req, res, next) => {
  console.log("req params: " + req.query.items);
  console.log("req params: " + req.params.categoryId);
  Category_SLTFR.findById(req.params.categoryId)
    .exec()
    .then(category => {
      if (!category) {
        return res.status(404).json({
          message: "Category not found"
        });
      }
      if(req.query.items && req.query.items == 'true'){
        ItemsController.items_get_by_category_pp(req.params.categoryId).then(items => {
          res.status(200).json({
            category: category,
            items: items,
            request: {
              type: "GET",
              url: "http://localhost:3000/categories"
            }
          });
        });
      }else{
        res.status(200).json({
          category: category,
          request: {
            type: "GET",
            url: "http://localhost:3000/categories"
          }
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};

exports.categories_delete_category_sltfr = (req, res, next) => {
  Category_SLTFR.remove({ _id: req.params.categoryId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Category deleted"
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};