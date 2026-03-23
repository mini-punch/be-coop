const Reservation = require('../models/Reservation');
const Coop = require('../models/Coop');
const BannedUser = require('../models/BannedUser');

exports.getReservations = async (req,res,next) => {
    let query;
    if(req.user.role !== 'admin'){
        //user ดูได้แค่ reservation ของตัวเอง
        query = Reservation.find({user:req.user.id}).populate({
            path: 'coop',
            select: 'name'
        });
    }else{
        // admin ดูได้หมดเรยย
        query = Reservation.find()
        .populate({
            path: 'user',
            select: 'name email'
        })
        .populate({
            path: 'coop',
            select: 'name'
        });
    }
    try{
        const reservations = await query;
        res.status(200).json({
            success:true,
            count:reservations.length,
            data: reservations
        });
    } catch(error){
        console.log(error);
        return res.status(500).json({success:false, message: "Cannot find Reservations"});
    }
};

exports.getReservation = async (req, res, next) => {
    try {
        const reservation = await Reservation.findById(req.params.id).populate({
            path: 'coop',
            select: 'name tel'
        });

        if (!reservation) {
            return res.status(404).json({
                success: false,
                message: `No reservation with the id of ${req.params.id}`
            });
        }

        res.status(200).json({success: true,data: reservation});
    } catch (err) {
        console.log(err.stack);
        return res.status(500).json({success: false,message: "Cannot find Reservation"});
    }
};

exports.addReservation = async (req,res,next) => {
    try{
        req.body.coop = req.params.coopId;
        const coop = await Coop.findById(req.params.coopId);

        if(!coop){
            return res.status(404).json({success:false,message:`No co-working space with the id of ${req.params.coopId}`});
        }
        //check banned
        const bannedUser = await BannedUser.findOne({user: req.user.id});
        if(bannedUser && req.user.role !== 'admin'){
            return res.status(403).json({
                success: false,
                message: 'You are banned from making reservations'
            });
        }
        // check limit (pending & checked_in)
        req.body.user = req.user.id;
        const existedReservations = await Reservation.countDocuments({
            user: req.user.id,
            status: { $in: ['pending', 'checked_in'] }
        });

        if(existedReservations >= 3 && req.user.role !== 'admin'){
            return res.status(400).json({success:false, message: `The user with ID ${req.user.id} has already made 3 reservations`});
        }

        const reservation = await Reservation.create(req.body);
        res.status(201).json({
            success: true,
            data: reservation
        });

    }catch(error){
        console.log(error);
        return res.status(500).json({success:false,message: "Cannot create Reservation"});
    }
};

exports.updateReservation = async(req,res,next) => {
    try {
        let reservation = await Reservation.findById(req.params.id);

        if(!reservation){
            return res.status(404).json({success:false, message: `No reservation with the id of ${req.params.id}`});
        }

            if(reservation.user.toString() !== req.user.id && req.user.role !== 'admin'){
                return res.status(401).json({success:false,message:`User ${req.user.id} is not authorized to update this areservation`});
            }

        reservation = await Reservation.findByIdAndUpdate(req.params.id,req.body, {
            new:true,
            runValidators:true
        });

        res.status(200).json({
            success: true,
            data: reservation
        });
    } catch(error){
        console.log(error);
        return res.status(500).json({success:false, message: "Cannot update Reservation"});
    }
};

exports.deleteReservation = async (req,res,next) => {
    try {
        const reservation = await Reservation.findById(req.params.id);

        if(!reservation){
            return res.status(404).json({
                success:false,
                message:`No reservation with the id of ${req.params.id}`
            });
        }

        if(reservation.user.toString() !== req.user.id && req.user.role !== 'admin'){
            return res.status(401).json({success:false, message:`User ${req.user.id} is not authorized to delete this reservation`});
        }

        await reservation.deleteOne();
        res.status(200).json({
            success:true,
            data: {}
        });
    } catch(error){
        console.log(error);
        return res.status(500).json({success:false, message:"Cannot delete Reservation"});
    }
};

exports.checkIn = async(req,res) => {
    try{
        const reservation = await Reservation.findById(req.params.id);

        if(!reservation) {
            return res.status(404).json({success: false, message: "Reservation not found"});
        }

        if(reservation.user.toString() !== req.user.id && req.user.role !== 'admin'){
            return res.status(401).json({
                success: false,
                message: "Not authorized to check in"
            });
        }
        //ห้ามเช้คอินถ้าไม่ใช่ pending
        if(reservation.status !== 'pending'){
            return res.status(400).json({
                success: false,
                message: "Reservation cannot be checked in"
            });
        }


        const updatedReservation = await Reservation.updateStatus(reservation._id, 'checked_in');

        res.status(200).json({
            success: true,
            data: updatedReservation
        });

    } catch(error){
        console.log(error);
        return res.status(500).json({success:false, message:"Check-in failed"});
    }
};

