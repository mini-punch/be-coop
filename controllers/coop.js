
const Coop = require('../models/Coop');
const Reservation = require('../models/Reservation');

exports.getCoops= async(req,res,next) => {
    let query;
    const reqQuery = {...req.query};
    const removeFields = ['select','sort','page','limit'];
    removeFields.forEach(param=>delete reqQuery[param]);
    console.log(reqQuery);
    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    query = Coop.find(JSON.parse(queryStr)).populate('reservations');

    if(req.query.select){
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }
    if(req.query.sort){
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else{
        query = query.sort('-createdAt');
    }

    const page = parseInt(req.query.page,10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;

    const startIndex = (page-1)*limit;
    const endIndex = page * limit;
    
    try{
        const total = await Coop.countDocuments();
        query = query.skip(startIndex).limit(limit);
        const coops = await query;
        const pagination = {};

        if(endIndex < total){
            pagination.next = {
                page:page+1,
                limit
            }
        }

        if(startIndex > 0){
            pagination.prev = {
                page:page-1,
                limit
            }
        }
        res.status(200).json({success:true, count:coops.length, pagination, data:coops});
    } catch(err) {
        res.status(400).json({success:false});
    }
};

exports.getCoop = async (req, res, next) => {
    try{
        const coop = await Coop.findById(req.params.id).populate('reservations');
        if(!coop){
            return res.status(400).json({success:false});
        }
        res.status(200).json({success: true, data:coop});
    }
    catch(err){
        res.status(400).json({success:false});
    }

};

exports.createCoop= async(req,res,next) => {
    const coop = await Coop.create(req.body);
    res.status(201).json({
        success: true,
        data:coop
    });
};

exports.updateCoop = async(req,res,next) => {
    try{
        const coop = await Coop.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if(!coop){
            return res.status(400).json({success:false});
        }

        res.status(200).json({success:true, data: coop});
    } catch(err) {
        res.status(400).json({success:false});
    }
};

exports.deleteCoop = async(req,res,next) => {
    try{
        const coop = await Coop.findById(req.params.id);

        if(!coop){
            return res.status(404).json({success: false, message: `Co-working space not found with id of ${req.params.id}`});
        }
        await Reservation.deleteMany({ coop: req.params.id});
        await Coop.deleteOne({ _id: req.params.id});

        res.status(200).json({success:true, data:{}});
    } catch(err){
        res.status(400).json({success:false});
    }
};

