const { admin } = require("../../config/contant");
const paginate = (schema) => {
  var multilanguageValues = 'title_';

  schema.statics.paginateadmin = async function (filter, options, req) {


    const sort = {};
    // if (options.sortBy) {
    //   const parts = options.sortBy.split(':');
    //   sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    // } else {
      sort.createdAt = -1;
    // }
    options.page = Number(options.page) + 1;
    const limit = options.limit && parseInt(options.limit, 10) > 0 ? parseInt(options.limit, 10) : 10;
    const page = options.page && parseInt(options.page, 10) > 0 ? parseInt(options.page, 10) : 1;
    const skip = (page - 1) * limit;


    var filters = {}
    if (filter.length > 0) {
      filters = {
        $and: filter,
      };
    }
    var agrigateFilters = [];
    for (let k in filter) {
      agrigateFilters.push({ $match: filter[k] })
    }


    console.log('filter', filter)


    agrigateFilters.push({
      '$lookup': {
        from: 'users',
        let: { user: "$user" },
        as: 'userObj',
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$user"] } } }, {
            $project: { password: 0, __v: 0, updatedAt: 0, createdAt: 0, login_with: 0 }
          }
        ],
      }
    })



    agrigateFilters.push({
      $unwind: {
        path: '$userObj',
        preserveNullAndEmptyArrays: true,
      }
    })




    agrigateFilters.push({
      '$lookup': {
        from: 'users',
        let: { company: "$company" },
        as: 'companyObj',
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$company"] } } }, {
            $project: { password: 0, __v: 0, updatedAt: 0, createdAt: 0, login_with: 0 }
          }
        ],
      }
    })



    agrigateFilters.push({
      $unwind: {
        path: '$companyObj',
        preserveNullAndEmptyArrays: true,
      }
    })



    agrigateFilters.push({
      '$lookup': {
        from: 'users',
        let: { driver: "$driver" },
        as: 'driverObj',
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$driver"] } } }, {
            $project: { password: 0, __v: 0, updatedAt: 0, createdAt: 0, login_with: 0 }
          }
        ],
      }
    })



    agrigateFilters.push({
      $unwind: {
        path: '$driverObj',
        preserveNullAndEmptyArrays: true,
      }
    })



    // ecomerance

    agrigateFilters.push({
      '$lookup': {
        from: 'users',
        let: { ecommerce: "$ecommerce" },
        as: 'ecommerceObj',
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$ecommerce"] } } }, {
            $project: { password: 0, __v: 0, updatedAt: 0, createdAt: 0, login_with: 0 }
          }
        ],
      }
    });



    agrigateFilters.push({
      $unwind: {
        path: '$ecommerceObj',
        preserveNullAndEmptyArrays: true,
      }
    });

    //end



    agrigateFilters.push({
      '$lookup': {
        from: 'addressshipments',
        let: { from: "$from" },
        as: 'fromObj',
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$from"] } } }, {
            $project: { __v: 0 }
          }
        ],
      }
    })


    agrigateFilters.push({
      $unwind: {
        path: '$fromObj',
        preserveNullAndEmptyArrays: true,
      }
    })

    agrigateFilters.push({
      '$lookup': {
        from: 'cities',
        let: { city: "$fromObj.city" },
        as: 'fromObj.cityObj',
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$city"] } } }
        ],
      }
    })

    agrigateFilters.push({
      $unwind: {
        path: '$fromObj.cityObj',
        preserveNullAndEmptyArrays: true,
      }
    })





    agrigateFilters.push({
      '$lookup': {
        from: 'addressshipments',
        let: { to: "$to" },
        as: 'toObj',
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$to"] } } }, {
            $project: { __v: 0 }
          }
        ],
      }
    })


    agrigateFilters.push({
      $unwind: {
        path: '$toObj',
        preserveNullAndEmptyArrays: true,
      }
    })

    agrigateFilters.push({
      '$lookup': {
        from: 'cities',
        let: { city: "$toObj.city" },
        as: 'toObj.cityObj',
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$city"] } } },
        ],
      }
    })

    agrigateFilters.push({
      $unwind: {
        path: '$toObj.cityObj',
        preserveNullAndEmptyArrays: true,
      }
    })




    agrigateFilters.push({
      '$lookup': {
        from: 'categoriessubs',
        let: { subCategory: "$subCategory" },
        as: 'subCategoryObj',
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$subCategory"] } } },
        ],
      }
    })


    agrigateFilters.push({
      $unwind: {
        path: '$subCategoryObj',
        preserveNullAndEmptyArrays: true,
      }
    })

    agrigateFilters.push({
      '$lookup': {
        from: 'categories',
        let: { category: "$subCategoryObj.category" },
        as: 'subCategoryObj.categoryObj',
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$category"] } } },
        ],
      }
    })


    agrigateFilters.push({
      $unwind: {
        path: '$subCategoryObj.categoryObj',
        preserveNullAndEmptyArrays: true,
      }
    })



    agrigateFilters.push({
      '$lookup': {
        from: 'types',
        let: { type: "$type" },
        as: 'typeObj',
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$type"] } } },
        ],
      }
    })


    agrigateFilters.push({
      $unwind: {
        path: '$typeObj',
        preserveNullAndEmptyArrays: true,
      }
    })


    agrigateFilters.push({
      '$lookup': {
        from: 'shipmentslogs',
        let: { shipment: "$_id" },
        as: 'shipmentslogs',
        pipeline: [
          { $match: { $expr: { $eq: ["$shipment", "$$shipment"] } } }
        ],
      }
    })


    agrigateFilters.push({
      $unwind: {
        path: '$shipmentslogs',
        preserveNullAndEmptyArrays: true,
      }
    })


    agrigateFilters.push({
      '$lookup': {
        from: 'users',
        let: { id: "$shipmentslogs.to" },
        as: 'shipmentslogs.to',
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$id"] } } },
          {
            $project: { first_name: 1, last_name: 1, email: 1, company_name: 1 }
          }
        ],
      }
    })

    agrigateFilters.push({
      $unwind: {
        path: '$shipmentslogs.to',
        preserveNullAndEmptyArrays: true,
      }
    })

    agrigateFilters.push({
      $group: {
        "_id": "$_id",
        "cost": { "$first": "$cost" },
        "tag": { "$first": "$tag" },
        "status": { "$first": "$status" },
        "other": { "$first": "$other" },
        "weight": { "$first": "$weight" },
        "comments": { "$first": "$comments" },
        "createdAt": { "$first": "$createdAt" },
        "assignedStatus": { "$first": "$assignedStatus" },
        "user": { "$first": "$user" },
        "company": { "$first": "$company" },
        "driver": { "$first": "$driver" },

        "deliveryDate": { "$first": "$deliveryDate" },
        "dispatchDate": { "$first": "$dispatchDate" },
        "pickedhDate": { "$first": "$pickedhDate" },
        "deliverdDate": { "$first": "$deliverdDate" },
        "driverAssignDate": { "$first": "$driverAssignDate" },
        "companyAssignDate": { "$first": "$companyAssignDate" },

        "to": { "$first": "$to" },
        "subCategory": { "$first": "$subCategory" },
        "type": { "$first": "$type" },
        "updatedAt": { "$first": "$updatedAt" },
        "userObj": { "$first": "$userObj" },
        "driverObj": { "$first": "$driverObj" },
        "companyObj": { "$first": "$companyObj" },
        "fromObj": { "$first": "$fromObj" },
        "toObj": { "$first": "$toObj" },
        "subCategoryObj": { "$first": "$subCategoryObj" },
        "typeObj": { "$first": "$typeObj" },
        "shipmentslogs": { "$push": "$shipmentslogs" },

      }
    })


    const countPromise = await this.aggregate([...agrigateFilters, { $count: "count" }]);
    const docsPromise = this.aggregate(agrigateFilters).skip(skip).limit(limit).sort(sort);

    return Promise.all([countPromise[0] ? countPromise[0]['count'] : 0, docsPromise]).then((values) => {
      var [totalResults, results] = values;
      const totalPages = Math.ceil(totalResults / limit);
      const result = {
        results,
        page,
        limit,
        totalPages,
        totalResults,
      };
      return Promise.resolve(result);
    });




  };
  schema.statics.paginateuser = async function (filter, options, req) {

    const sort = {};
    if (options.sortBy) {
      const parts = options.sortBy.split(':');
      sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    } else {
      sort.createdAt = -1;
    }
    options.page = Number(options.page) + 1;
    const limit = options.limit && parseInt(options.limit, 10) > 0 ? parseInt(options.limit, 10) : 10;
    const page = options.page && parseInt(options.page, 10) > 0 ? parseInt(options.page, 10) : 1;
    const skip = (page - 1) * limit;


    var filters = {}
    if (filter.length > 0) {
      filters = {
        $and: filter,
      };
    }
    var agrigateFilters = [];
    for (let k in filter) {
      agrigateFilters.push({ $match: filter[k] })
    }



    agrigateFilters.push({
      '$lookup': {
        from: 'users',
        let: { user: "$user" },
        as: 'userObj',
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$user"] } } }, {
            $project: { password: 0, __v: 0, updatedAt: 0, createdAt: 0, login_with: 0 }
          }
        ],
      }
    })



    agrigateFilters.push({
      $unwind: {
        path: '$userObj',
        preserveNullAndEmptyArrays: true,
      }
    })



    agrigateFilters.push({
      '$lookup': {
        from: 'users',
        let: { company: "$company" },
        as: 'companyObj',
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$company"] } } }, {
            $project: { password: 0, __v: 0, updatedAt: 0, createdAt: 0, login_with: 0 }
          }
        ],
      }
    })



    agrigateFilters.push({
      $unwind: {
        path: '$companyObj',
        preserveNullAndEmptyArrays: true,
      }
    })



    agrigateFilters.push({
      '$lookup': {
        from: 'users',
        let: { driver: "$driver" },
        as: 'driverObj',
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$driver"] } } }, {
            $project: { password: 0, __v: 0, updatedAt: 0, createdAt: 0, login_with: 0 }
          }
        ],
      }
    })



    agrigateFilters.push({
      $unwind: {
        path: '$driverObj',
        preserveNullAndEmptyArrays: true,
      }
    })




    agrigateFilters.push({
      '$lookup': {
        from: 'users',
        let: { company: "$company" },
        as: 'companyObj',
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$company"] } } }, {
            $project: { password: 0, __v: 0, updatedAt: 0, createdAt: 0, login_with: 0 }
          }
        ],
      }
    })



    agrigateFilters.push({
      $unwind: {
        path: '$companyObj',
        preserveNullAndEmptyArrays: true,
      }
    })



    agrigateFilters.push({
      '$lookup': {
        from: 'users',
        let: { driver: "$driver" },
        as: 'driverObj',
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$driver"] } } }, {
            $project: { password: 0, __v: 0, updatedAt: 0, createdAt: 0, login_with: 0 }
          }
        ],
      }
    })



    agrigateFilters.push({
      $unwind: {
        path: '$driverObj',
        preserveNullAndEmptyArrays: true,
      }
    })


    agrigateFilters.push({
      '$lookup': {
        from: 'addressshipments',
        let: { from: "$from" },
        as: 'fromObj',
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$from"] } } }, {
            $project: { __v: 0 }
          }
        ],
      }
    })


    agrigateFilters.push({
      $unwind: {
        path: '$fromObj',
        preserveNullAndEmptyArrays: true,
      }
    })

    agrigateFilters.push({
      '$lookup': {
        from: 'cities',
        let: { city: "$fromObj.city" },
        as: 'fromObj.cityObj',
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$city"] } } }, {
            $project: {
              title: '$' + multilanguageValues + req.headers['accept-language'] ? '$' + multilanguageValues + req.headers['accept-language'] : '$' + multilanguageValues + 'en', active: 1,
            }
          }
        ],
      }
    })

    agrigateFilters.push({
      $unwind: {
        path: '$fromObj.cityObj',
        preserveNullAndEmptyArrays: true,
      }
    })





    agrigateFilters.push({
      '$lookup': {
        from: 'addressshipments',
        let: { to: "$to" },
        as: 'toObj',
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$to"] } } }, {
            $project: { __v: 0 }
          }
        ],
      }
    })


    agrigateFilters.push({
      $unwind: {
        path: '$toObj',
        preserveNullAndEmptyArrays: true,
      }
    })

    agrigateFilters.push({
      '$lookup': {
        from: 'cities',
        let: { city: "$toObj.city" },
        as: 'toObj.cityObj',
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$city"] } } },
          {
            $project: { title: '$' + multilanguageValues + req.headers['accept-language'] ? '$' + multilanguageValues + req.headers['accept-language'] : '$' + multilanguageValues + 'en', active: 1, }
          }
        ],
      }
    })

    agrigateFilters.push({
      $unwind: {
        path: '$toObj.cityObj',
        preserveNullAndEmptyArrays: true,
      }
    })




    agrigateFilters.push({
      '$lookup': {
        from: 'categoriessubs',
        let: { subCategory: "$subCategory" },
        as: 'subCategoryObj',
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$subCategory"] } } },
          {
            $project: { title: '$' + multilanguageValues + req.headers['accept-language'] ? '$' + multilanguageValues + req.headers['accept-language'] : '$' + multilanguageValues + 'en', active: 1, category: 1 }
          }
        ],
      }
    })


    agrigateFilters.push({
      $unwind: {
        path: '$subCategoryObj',
        preserveNullAndEmptyArrays: true,
      }
    })

    agrigateFilters.push({
      '$lookup': {
        from: 'categories',
        let: { category: "$subCategoryObj.category" },
        as: 'subCategoryObj.categoryObj',
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$category"] } } },
          {
            $project: { title: '$' + multilanguageValues + req.headers['accept-language'] ? '$' + multilanguageValues + req.headers['accept-language'] : '$' + multilanguageValues + 'en', price: 1, weight: 1, icon: 1 }
          }
        ],
      }
    })


    agrigateFilters.push({
      $unwind: {
        path: '$subCategoryObj.categoryObj',
        preserveNullAndEmptyArrays: true,
      }
    })



    agrigateFilters.push({
      '$lookup': {
        from: 'types',
        let: { type: "$type" },
        as: 'typeObj',
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$type"] } } },
          {
            $project: { title: '$' + multilanguageValues + req.headers['accept-language'] ? '$' + multilanguageValues + req.headers['accept-language'] : '$' + multilanguageValues + 'en', duration: 1, price: 1, image: 1 }
          }
        ],
      }
    })


    agrigateFilters.push({
      $unwind: {
        path: '$typeObj',
        preserveNullAndEmptyArrays: true,
      }
    })


    agrigateFilters.push({
      '$lookup': {
        from: 'shipmentslogs',
        let: { shipment: "$_id" },
        as: 'shipmentslogs',
        pipeline: [
          { $match: { $expr: { $eq: ["$shipment", "$$shipment"] } } }
        ],
      }
    })


    agrigateFilters.push({
      $unwind: {
        path: '$shipmentslogs',
        preserveNullAndEmptyArrays: true,
      }
    })


    agrigateFilters.push({
      '$lookup': {
        from: 'users',
        let: { id: "$shipmentslogs.to" },
        as: 'shipmentslogs.to',
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$id"] } } },
          {
            $project: { first_name: 1, last_name: 1, email: 1, company_name: 1 }
          }
        ],
      }
    })

    agrigateFilters.push({
      $unwind: {
        path: '$shipmentslogs.to',
        preserveNullAndEmptyArrays: true,
      }
    })

    agrigateFilters.push({
      $group: {
        "_id": "$_id",
        "cost": { "$first": "$cost" },
        "tag": { "$first": "$tag" },
        "status": { "$first": "$status" },
        "other": { "$first": "$other" },
        "weight": { "$first": "$weight" },
        "comments": { "$first": "$comments" },
        "createdAt": { "$first": "$createdAt" },
        "user": { "$first": "$user" },

        "deliveryDate": { "$first": "$deliveryDate" },
        "dispatchDate": { "$first": "$dispatchDate" },
        "pickedhDate": { "$first": "$pickedhDate" },
        "deliverdDate": { "$first": "$deliverdDate" },
        "driverAssignDate": { "$first": "$driverAssignDate" },
        "companyAssignDate": { "$first": "$companyAssignDate" },

        "company": { "$first": "$company" },
        "driver": { "$first": "$driver" },
        "to": { "$first": "$to" },
        "assignedStatus": { "$first": "$assignedStatus" },
        "subCategory": { "$first": "$subCategory" },
        "type": { "$first": "$type" },
        "updatedAt": { "$first": "$updatedAt" },
        "userObj": { "$first": "$userObj" },
        "driverObj": { "$first": "$driverObj" },
        "companyObj": { "$first": "$companyObj" },
        "fromObj": { "$first": "$fromObj" },
        "toObj": { "$first": "$toObj" },
        "subCategoryObj": { "$first": "$subCategoryObj" },
        "typeObj": { "$first": "$typeObj" },
        "shipmentslogs": { "$push": "$shipmentslogs" },

      }
    })


    const countPromise = this.countDocuments(filters);
    const docsPromise = this.aggregate(agrigateFilters).skip(skip).limit(limit).sort(sort);


    return Promise.all([countPromise, docsPromise]).then((values) => {
      var [totalResults, results] = values;
      const totalPages = Math.ceil(totalResults / limit);
      const result = {
        results,
        page,
        limit,
        totalPages,
        totalResults,
      };
      return Promise.resolve(result);
    });



  };
};

module.exports = paginate;
