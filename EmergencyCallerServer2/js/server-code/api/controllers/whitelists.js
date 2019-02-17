const mongoose = require("mongoose");

const request = require('request');

const fcmServerKey = "key=AAAA_O9PQtc:APA91bFwO2wGvQVwCMgmdHX7UbSfLTgvq7BeZHPff8VjH7QKb3oLOgTCKfa-naCU08rfgdLq95y9enrEhchWB_gvGL_RbFWwGp9UTV-qEKbHvq22J8ntGVGPt082Zy72sy2GO72lMJyn";
const fcmPostURL = "https://fcm.googleapis.com/fcm/send";
const Whitelist = require("../models/whitelist");

const trimPhoneNumber = function(phoneNum){
  let len = phoneNum.length > 11 ? 11 : phoneNum.length;
  const phNo = phoneNum.split('').reverse().join('').substring(0,len).split('').reverse().join('');
  return phNo;
}

exports.items_get_all = (req, res, next) => {
  Item.find()
    .select("item_name pack_sizes makes category is_active _id description")
    .populate('category', 'category_name')
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        items: docs.map(doc => {
          // console.log("doc: " + doc);
          return {
            item_name: doc.item_name,
            pack_sizes: doc.pack_sizes,
            makes: doc.makes,
            category: doc.category,
            is_active: doc.is_active,
            description: doc.description,
            _id: doc._id,
            request: {
              type: "GET",
              url: "http://localhost:3000/items/" + doc._id
            }
          };
        })
      };
      //   if (docs.length >= 0) {
      res.status(200).json(response);
      //   } else {
      //       res.status(404).json({
      //           message: 'No entries found'
      //       });
      //   }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.items_create_item = (req, res, next) => {
  console.log("category_id: " + req.body.category_id);
  Category.findById(req.body.category_id)
    .then(category => {
      if (!category) {
        return res.status(404).json({
          message: "Category not found"
        });
      }
      const isActive = true;
      if (req.body.is_active != "true") isActive = false;
      const packSizeArr = req.body.pack_sizes.split(";");
      console.log("pack sizes arr: " + packSizeArr);
      const makesArr = req.body.makes.split(";");
      console.log("makes arr: " + makesArr);
      const item = new Item({
        _id: new mongoose.Types.ObjectId(),
        item_name: req.body.item_name,
        pack_sizes: packSizeArr,
        makes: makesArr,
        category: category._id,
        description: req.body.description,
        is_active: isActive
      });
      return item.save();
    })
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Item stored",
        createdItem: {
          _id: result._id,
          item_name: result.item_name,
          pack_sizes: result.pack_sizes,
          makes: result.makes,
          category: result.category,
          description: result.description,
          is_active: result.is_active
        },
        request: {
          type: "GET",
          url: "http://localhost:3000/items/" + result._id
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
//GET WHITELIST FOR A PHONE NO
exports.get_whitelist = (req, res, next) => {
  const phNo = trimPhoneNumber(req.params.phoneNo);
  Whitelist.findOne()
    .select('whitelist')
    .where('phone_no').equals(phNo)
    .exec()
    .then(docs => {
      console.log("From database", docs);
      res.status(200).json({ whitelist: docs.whitelist });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};
//CREATE DEVICE
exports.create_device = (req, res, next) => {
  const phoneNo = trimPhoneNumber(req.body.phoneNo);
  console.log("token :", req.body.token);
  console.log("phoneNo : ", phoneNo);
  Whitelist.findOneAndUpdate({ phone_no: phoneNo }, { $set: { token: req.body.token } }, { new: true })
    .then(doc => {
      if (doc == null) {
        console.log("Could not find!");
        const device = new Whitelist({
          _id: new mongoose.Types.ObjectId(),
          token: req.body.token,
          phone_no: phoneNo,
          whitelist: []
        });
        device
          .save()
          .then(result => {
            console.log(result);
            res.status(201).json({
              message: "Created Device Successfully",
              createdDevice: {
                phone_no: result.phoneNo,
                device_token: result.token,
                _id: result._id
              }
            });
          })
          .catch(err => {
            console.log(err);
            res.status(500).json({
              error: err
            });
          });
      }
      else {
        console.log("Found it!");
        res.status(201).json({
          message: "Created Device Successfully",
          createdDevice: {
            phone_no: doc.phoneNo,
            device_token: doc.token,
            _id: doc._id
          }
        });
      }
    })
    .catch(err => {
      console.log(err);
    })
};

//TRIGGER EMERGENCY CALL
exports.trigger_call = (req, res, next) => {
  console.log("token :", req.body.token);
  const phoneNo = trimPhoneNumber(req.body.phoneNo);
  const toPhoneNo = trimPhoneNumber(req.body.toPhoneNo);
  console.log("phoneNo : ", phoneNo);
  console.log('toPhoneNo : ', toPhoneNo);
  console.log('time : ', req.body.time);

  Whitelist.findOne()
    .select()
    .where('phone_no').equals(toPhoneNo)
    .exec()
    .then(doc => {
      console.log("doc : ",doc);
      if (doc.token != null) {
        const payLoad = {
          "to": doc.token,
          "data": {
            "fromPhoneNo": phoneNo,
            "time": req.body.time
          }
        }

        console.log("payLoad", payLoad);

        const triggerCallRequest = {
          uri: fcmPostURL,
          body: JSON.stringify(payLoad),
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': fcmServerKey
          }
        }

        const resp = request(triggerCallRequest, (error, response) => {
          if (error) {
            console.log("Error", error);
            return error;
          }
          else {
            //console.log("Resp", response);
            return response;
          }
        });

        res.status(200).json({
          message: resp
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
}

exports.items_edit_item = (req, res, next) => {
  // console.log("update ops: " + JSON.stringify(req.body.updateOps));
  const id = req.params.itemId;
  const updateOps = {};
  const isActive = true;
  if (req.body.is_active && req.body.is_active != "true") isActive = false;
  const packSizeArr = req.body.pack_sizes.split(";");
  console.log("pack_sizes arr: " + packSizeArr);
  const makesArr = req.body.makes.split(";");
  console.log("makes arr: " + makesArr);
  updateOps["category"] = req.body.category;
  updateOps["item_name"] = req.body.item_name;
  updateOps["pack_sizes"] = packSizeArr;
  updateOps["makes"] = makesArr;
  updateOps["is_active"] = isActive;
  updateOps["description"] = req.body.description;
  // for (const ops of req.body.updateOps) {
  //   updateOps[ops.propName] = ops.value;
  // }
  Item.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Item updated',
        request: {
          type: 'GET',
          url: 'http://localhost:3000/items/' + id
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

exports.items_delete_item = (req, res, next) => {
  const id = req.params.itemId;
  Item.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Item deleted'
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.items_get_by_category = category_id => {
  return Item.find()
    .select("item_name pack_sizes makes category is_active _id description")
    .where('category').equals(category_id)
    .exec()
    .then(docs => {
      // return {
      //   count: docs.length,
      //   items: docs.map(doc => {
      //     return {
      //       item_name: doc.item_name,
      //       pack_sizes: doc.pack_sizes,
      //       makes: doc.makes,
      //       category: doc.category,
      //       is_active: doc.is_active,
      //       _id: doc._id,
      //       request: {
      //         type: "GET",
      //         url: "http://localhost:3000/items/" + doc._id
      //       }
      //     };
      //   })
      // };
      return docs;
    })
    .catch(err => {
      console.log(err);
      return null;
    });
};

exports.items_get_all_pp = (req, res, next) => {
  Item_PP.find()
    .select("item_name pack_sizes price category is_active _id description")
    .populate('category', 'category_name')
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        items: docs.map(doc => {
          // console.log("doc: " + doc);
          return {
            item_name: doc.item_name,
            pack_sizes: doc.pack_sizes,
            price: doc.price,
            category: doc.category,
            is_active: doc.is_active,
            description: doc.description,
            _id: doc._id,
            request: {
              type: "GET",
              url: "http://localhost:3000/items/" + doc._id
            }
          };
        })
      };
      //   if (docs.length >= 0) {
      res.status(200).json(response);
      //   } else {
      //       res.status(404).json({
      //           message: 'No entries found'
      //       });
      //   }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.items_create_item_pp = (req, res, next) => {
  console.log("category_id: " + req.body.category_id);
  Category_PP.findById(req.body.category_id)
    .then(category => {
      if (!category) {
        return res.status(404).json({
          message: "Category not found"
        });
      }
      const isActive = true;
      if (req.body.is_active != "true") isActive = false;
      const packSizeArr = req.body.pack_sizes.split(";");
      console.log("pack sizes arr: " + packSizeArr);
      const item = new Item_PP({
        _id: new mongoose.Types.ObjectId(),
        item_name: req.body.item_name,
        pack_sizes: packSizeArr,
        price: req.body.price,
        category: category._id,
        description: req.body.description,
        is_active: isActive
      });
      return item.save();
    })
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Item stored",
        createdItem: {
          _id: result._id,
          item_name: result.item_name,
          pack_sizes: result.pack_sizes,
          price: result.price,
          category: result.category,
          description: result.description,
          is_active: result.is_active
        },
        request: {
          type: "GET",
          url: "http://localhost:3000/items/" + result._id
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

exports.items_get_item_pp = (req, res, next) => {
  const id = req.params.itemId;
  Item_PP.findById(id)
    .select('item_name pack_sizes price category is_active _id description')
    .populate('category', 'category_name')
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
          item: doc,
          request: {
            type: 'GET',
            url: 'http://localhost:3000/items'
          }
        });
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.items_edit_item_pp = (req, res, next) => {
  // console.log("update ops: " + JSON.stringify(req.body.updateOps));
  const id = req.params.itemId;
  const updateOps = {};
  const isActive = true;
  if (req.body.is_active && req.body.is_active != "true") isActive = false;
  const packSizeArr = req.body.pack_sizes.split(";");
  console.log("pack_sizes arr: " + packSizeArr);
  updateOps["category"] = req.body.category;
  updateOps["item_name"] = req.body.item_name;
  updateOps["pack_sizes"] = packSizeArr;
  updateOps["price"] = req.body.price;
  updateOps["is_active"] = isActive;
  updateOps["description"] = req.body.description;
  // for (const ops of req.body.updateOps) {
  //   updateOps[ops.propName] = ops.value;
  // }
  Item_PP.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Item updated',
        request: {
          type: 'GET',
          url: 'http://localhost:3000/items/' + id
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

exports.items_delete_item_pp = (req, res, next) => {
  const id = req.params.itemId;
  Item_PP.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Item deleted'
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.items_get_by_category_pp = category_id => {
  return Item_PP.find()
    .select("item_name pack_sizes price category is_active _id description")
    .where('category').equals(category_id)
    .exec()
    .then(docs => {
      // return {
      //   count: docs.length,
      //   items: docs.map(doc => {
      //     return {
      //       item_name: doc.item_name,
      //       pack_sizes: doc.pack_sizes,
      //       price: doc.price,
      //       category: doc.category,
      //       is_active: doc.is_active,
      //       _id: doc._id,
      //       request: {
      //         type: "GET",
      //         url: "http://localhost:3000/items/" + doc._id
      //       }
      //     };
      //   })
      // };
      return docs;
    })
    .catch(err => {
      console.log(err);
      return null;
    });
};


exports.items_get_all_sltfr = (req, res, next) => {
  Item_SLTFR.find()
    .select("item_name pack_sizes price category is_active _id description")
    .populate('category', 'category_name')
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        items: docs.map(doc => {
          // console.log("doc: " + doc);
          return {
            item_name: doc.item_name,
            pack_sizes: doc.pack_sizes,
            price: doc.price,
            category: doc.category,
            is_active: doc.is_active,
            description: doc.description,
            _id: doc._id,
            request: {
              type: "GET",
              url: "http://localhost:3000/items/" + doc._id
            }
          };
        })
      };
      //   if (docs.length >= 0) {
      res.status(200).json(response);
      //   } else {
      //       res.status(404).json({
      //           message: 'No entries found'
      //       });
      //   }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.items_create_item_sltfr = (req, res, next) => {
  console.log("category_id: " + req.body.category_id);
  Category_SLTFR.findById(req.body.category_id)
    .then(category => {
      if (!category) {
        return res.status(404).json({
          message: "Category not found"
        });
      }
      const isActive = true;
      if (req.body.is_active != "true") isActive = false;
      const packSizeArr = req.body.pack_sizes.split(";");
      console.log("pack sizes arr: " + packSizeArr);
      const item = new Item_SLTFR({
        _id: new mongoose.Types.ObjectId(),
        item_name: req.body.item_name,
        pack_sizes: packSizeArr,
        price: req.body.price,
        category: category._id,
        description: req.body.description,
        is_active: isActive
      });
      return item.save();
    })
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Item stored",
        createdItem: {
          _id: result._id,
          item_name: result.item_name,
          pack_sizes: result.pack_sizes,
          price: result.price,
          category: result.category,
          description: result.description,
          is_active: result.is_active
        },
        request: {
          type: "GET",
          url: "http://localhost:3000/items/" + result._id
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

exports.items_get_item_sltfr = (req, res, next) => {
  const id = req.params.itemId;
  Item_SLTFR.findById(id)
    .select('item_name pack_sizes price category is_active _id description')
    .populate('category', 'category_name')
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
          item: doc,
          request: {
            type: 'GET',
            url: 'http://localhost:3000/items'
          }
        });
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.items_edit_item_sltfr = (req, res, next) => {
  // console.log("update ops: " + JSON.stringify(req.body.updateOps));
  const id = req.params.itemId;
  const updateOps = {};
  const isActive = true;
  if (req.body.is_active && req.body.is_active != "true") isActive = false;
  const packSizeArr = req.body.pack_sizes.split(";");
  console.log("pack_sizes arr: " + packSizeArr);
  updateOps["category"] = req.body.category;
  updateOps["item_name"] = req.body.item_name;
  updateOps["pack_sizes"] = packSizeArr;
  updateOps["price"] = req.body.price;
  updateOps["is_active"] = isActive;
  updateOps["description"] = req.body.description;
  // for (const ops of req.body.updateOps) {
  //   updateOps[ops.propName] = ops.value;
  // }
  Item_SLTFR.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Item updated',
        request: {
          type: 'GET',
          url: 'http://localhost:3000/items/' + id
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

exports.items_delete_item_sltfr = (req, res, next) => {
  const id = req.params.itemId;
  Item_SLTFR.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Item deleted'
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.items_get_by_category_sltfr = category_id => {
  return Item_SLTFR.find()
    .select("item_name pack_sizes price category is_active _id description")
    .where('category').equals(category_id)
    .exec()
    .then(docs => {
      // return {
      //   count: docs.length,
      //   items: docs.map(doc => {
      //     return {
      //       item_name: doc.item_name,
      //       pack_sizes: doc.pack_sizes,
      //       price: doc.price,
      //       category: doc.category,
      //       is_active: doc.is_active,
      //       _id: doc._id,
      //       request: {
      //         type: "GET",
      //         url: "http://localhost:3000/items/" + doc._id
      //       }
      //     };
      //   })
      // };
      return docs;
    })
    .catch(err => {
      console.log(err);
      return null;
    });
};