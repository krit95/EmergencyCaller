const mongoose = require("mongoose");

const Quote = require("../models/quote");

exports.get_random_quote = (req, res, next) => {
	Quote.aggregate(
	{
		$sample: { size: 1 }
	}, function(err, result){
		if(err){
			return res.status(500).json({
				error: err
			});		
		}
		else return res.status(200).json({
			message: result
		});
	});
};