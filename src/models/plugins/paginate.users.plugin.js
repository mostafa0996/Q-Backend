const { normal, company, ecommerce } = require("../../config/contant");

const paginate = (schema) => {

  schema.statics.paginate = async function (filter, options, filters) {

    const sort = {};
    if (options.sortBy) {
      const parts = options.sortBy.split(':');
      sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    } else {
      sort['createdAt'] = 1;
    }
    options.page = Number(options.page) + 1;
    const limit = options.limit && parseInt(options.limit, 10) > 0 ? parseInt(options.limit, 10) : 10;
    const page = options.page && parseInt(options.page, 10) > 0 ? parseInt(options.page, 10) : 1;
    const skip = (page - 1) * limit;


    var filters = {};
    if (filter.length > 0) {
      filters = { $and: filter };
    }


    var agrigateFilters = [];
    for (let k in filter) {
      console.log(filter[k])
      agrigateFilters.push({ $match: filter[k] })
    }




    agrigateFilters.push({
      '$lookup': {
        from: 'cities',
        let: { city: "$city" },
        as: 'cityObj',
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$city"] } } }
        ],
      }
    })


    agrigateFilters.push({
      $unwind: {
        path: '$cityObj',
        preserveNullAndEmptyArrays: true,
      }
    })


    var filters = {};
    if (filter.length > 0) {
      filters = { $and: filter };
    }

    const countPromise = this.countDocuments(filters);
    const docsPromise = this.aggregate(agrigateFilters).sort(sort).skip(skip).limit(limit);


    return Promise.all([countPromise, docsPromise]).then((values) => {
      const [totalResults, results] = values;
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

  schema.statics.queryUsersCountShipments = async function (filter, options, filters) {

    const sort = {};
    if (options.sortBy) {
      const parts = options.sortBy.split(':');
      sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    } else {
      sort['createdAt'] = 1;
    }
    options.page = Number(options.page) + 1;
    const limit = options.limit && parseInt(options.limit, 10) > 0 ? parseInt(options.limit, 10) : 10;
    const page = options.page && parseInt(options.page, 10) > 0 ? parseInt(options.page, 10) : 1;
    const skip = (page - 1) * limit;


    var filters = {};
    if (filter.length > 0) {
      filters = { $and: filter };
    }


    var agrigateFilters = [];
    for (let k in filter) {
      agrigateFilters.push({ $match: filter[k] })





      // for users

      if (filter[k].role === normal) {

        agrigateFilters.push({
          '$lookup': {
            from: 'shipments',
            let: { user: "$_id" },
            as: 'shipments',
            pipeline: [
              { $match: { $expr: { $eq: ["$user", "$$user"] } } }
            ],
          }
        })


        agrigateFilters.push(
          {
            $project: {
              shipments: { $size: "$shipments" },
              categories: 1,
              first_name: 1,
              last_name: 1,
              categoryWithVechiles: 1,
              phone: 1,
              role: 1,
              fcm: 1,
              active: 1,
              trade_licence: 1,
              company_name: 1,
              area: 1,
              createdAt: 1,
              email: 1,
              guest: 1,
              lat: 1,
              lng: 1,

              city: 1,
              website: 1,
              email: 1,
              guest: 1,
              designation: 1,

              date_issue_licences: 1,
              date_expired_licences: 1,
              locationText: 1
            }
          }
        )

        agrigateFilters.push(
          {
            "$group": {
              "_id": "$_id",
              "categories": { "$push": "$categoryObj" },
              "first_name": { "$first": "$first_name" },
              "last_name": { "$first": "$last_name" },
              "categoryWithVechiles": { "$first": "$categoryWithVechiles" },
              "phone": { "$first": "$phone" },
              "role": { "$first": "$role" },
              "fcm": { "$first": "$fcm" },
              "active": { "$first": "$active" },
              "trade_licence": { "$first": "$trade_licence" },
              "company_name": { "$first": "$company_name" },
              "area": { "$first": "$area" },
              "createdAt": { "$first": "$createdAt" },
              "permissions": { "$first": "$permissions" },
              "email": { "$first": "$email" },
              "guest": { "$first": "$guest" },
              "lat": { "$first": "$lat" },
              "lng": { "$first": "$lng" },
              "city": { "$first": "$city" },
              "website": { "$first": "$website" },
              "shipments": { "$first": "$shipments" },
              "designation": { "$first": "$designation" },
              "date_issue_licences": { "$first": "$date_issue_licences" },
              "date_expired_licences": { "$first": "$date_expired_licences" },
              "locationText": { "$first": "$locationText" },
            }
          }
        )

      }
      if (filter[k].role === ecommerce) {

        agrigateFilters.push({
          '$lookup': {
            from: 'shipments',
            let: { user: "$_id" },
            as: 'shipments',
            pipeline: [
              { $match: { $expr: { $eq: ["$company", "$$user"] } } }
            ],
          }
        })


        agrigateFilters.push(
          {
            $project: {
              shipments: { $size: "$shipments" },
              categories: 1,
              first_name: 1,
              last_name: 1,
              categoryWithVechiles: 1,
              phone: 1,
              role: 1,
              fcm: 1,
              active: 1,
              trade_licence: 1,
              company_name: 1,
              area: 1,
              createdAt: 1,
              email: 1,
              guest: 1,
              lat: 1,
              lng: 1,

              city: 1,
              website: 1,
              email: 1,
              guest: 1,
              designation: 1,

              date_issue_licences: 1,
              date_expired_licences: 1,
              locationText: 1
            }
          }
        )

        agrigateFilters.push(
          {
            "$group": {
              "_id": "$_id",
              "categories": { "$push": "$categoryObj" },
              "first_name": { "$first": "$first_name" },
              "last_name": { "$first": "$last_name" },
              "categoryWithVechiles": { "$first": "$categoryWithVechiles" },
              "phone": { "$first": "$phone" },
              "role": { "$first": "$role" },
              "fcm": { "$first": "$fcm" },
              "active": { "$first": "$active" },
              "trade_licence": { "$first": "$trade_licence" },
              "company_name": { "$first": "$company_name" },
              "area": { "$first": "$area" },
              "createdAt": { "$first": "$createdAt" },
              "permissions": { "$first": "$permissions" },
              "email": { "$first": "$email" },
              "guest": { "$first": "$guest" },
              "lat": { "$first": "$lat" },
              "lng": { "$first": "$lng" },
              "city": { "$first": "$city" },
              "website": { "$first": "$website" },
              "shipments": { "$first": "$shipments" },
              "designation": { "$first": "$designation" },
              "date_issue_licences": { "$first": "$date_issue_licences" },
              "date_expired_licences": { "$first": "$date_expired_licences" },
              "locationText": { "$first": "$locationText" },
            }
          }
        )

      }
      if (filter[k].role === company) {

        agrigateFilters.push({
          '$lookup': {
            from: 'shipments',
            let: { user: "$_id" },
            as: 'shipments',
            pipeline: [
              {
                "$match": {
                  "$expr": { "$eq": ["$company", "$$user"] },
                  "status": 3
                }
              }
            ],
          }
        })


        agrigateFilters.push(
          {
            $project: {
              shipments: { $size: "$shipments" },
              categories: 1,
              first_name: 1,
              last_name: 1,
              categoryWithVechiles: 1,
              phone: 1,
              role: 1,
              fcm: 1,
              active: 1,
              trade_licence: 1,
              company_name: 1,
              area: 1,
              createdAt: 1,
              email: 1,
              guest: 1,
              lat: 1,
              lng: 1,

              city: 1,
              website: 1,
              email: 1,
              guest: 1,
              designation: 1,

              date_issue_licences: 1,
              date_expired_licences: 1,
              locationText: 1
            }
          }
        )

        agrigateFilters.push(
          {
            "$group": {
              "_id": "$_id",
              "categories": { "$push": "$categoryObj" },
              "first_name": { "$first": "$first_name" },
              "last_name": { "$first": "$last_name" },
              "categoryWithVechiles": { "$first": "$categoryWithVechiles" },
              "phone": { "$first": "$phone" },
              "role": { "$first": "$role" },
              "fcm": { "$first": "$fcm" },
              "active": { "$first": "$active" },
              "trade_licence": { "$first": "$trade_licence" },
              "company_name": { "$first": "$company_name" },
              "area": { "$first": "$area" },
              "createdAt": { "$first": "$createdAt" },
              "permissions": { "$first": "$permissions" },
              "email": { "$first": "$email" },
              "guest": { "$first": "$guest" },
              "lat": { "$first": "$lat" },
              "lng": { "$first": "$lng" },
              "city": { "$first": "$city" },
              "website": { "$first": "$website" },
              "shipments": { "$first": "$shipments" },
              "designation": { "$first": "$designation" },
              "date_issue_licences": { "$first": "$date_issue_licences" },
              "date_expired_licences": { "$first": "$date_expired_licences" },
              "locationText": { "$first": "$locationText" },
            }
          }
        )

      }



    }




    agrigateFilters.push({
      '$lookup': {
        from: 'cities',
        let: { city: "$city" },
        as: 'cityObj',
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$city"] } } }
        ],
      }
    })


    agrigateFilters.push({
      $unwind: {
        path: '$cityObj',
        preserveNullAndEmptyArrays: true,
      }
    })


    var filters = {};
    if (filter.length > 0) {
      filters = { $and: filter };
    }



    const countPromise = this.countDocuments(filters);
    const docsPromise = this.aggregate(agrigateFilters).sort(sort);


    return Promise.all([countPromise, docsPromise]).then((values) => {
      const [totalResults, results] = values;
      const result = {
        results,
        totalResults,
      };
      return Promise.resolve(result);
    });
  };

  schema.statics.paginatebyDisctance = async function (filter, options, filters, location) {

    const sort = {};
    if (options.sortBy) {
      const parts = options.sortBy.split(':');
      sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    } else {
      sort['createdAt'] = 1;
    }
    options.page = Number(options.page) + 1;
    const limit = options.limit && parseInt(options.limit, 10) > 0 ? parseInt(options.limit, 10) : 10;
    const page = options.page && parseInt(options.page, 10) > 0 ? parseInt(options.page, 10) : 1;
    const skip = (page - 1) * limit;


    var filters = {};
    if (filter.length > 0) {
      filters = { $and: filter };
    }


    var agrigateFilters = [];



    agrigateFilters.push({
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [location.lng, location.lat]
        },
        maxDistance: (99999 * 999999999999999999999999999999999999999999999999999999999999),
        distanceField: "calculated",
        spherical: true
      },
    })

    for (let k in filter) {
      agrigateFilters.push({ $match: filter[k] })
    }




    agrigateFilters.push({
      '$lookup': {
        from: 'cities',
        let: { city: "$city" },
        as: 'cityObj',
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$city"] } } }
        ],
      }
    })





    agrigateFilters.push({
      $unwind: {
        path: '$cityObj',
        preserveNullAndEmptyArrays: true,
      }
    })


    var filters = {};
    if (filter.length > 0) {
      filters = { $and: filter };
    }

    const countPromise = this.countDocuments(filters);
    const docsPromise = this.aggregate(agrigateFilters).sort(sort).skip(skip).limit(limit);


    return Promise.all([countPromise, docsPromise]).then((values) => {
      const [totalResults, results] = values;
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
