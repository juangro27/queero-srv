const { Schema, model } = require("mongoose");

const countrySchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required.'],
            lowercase: true,
            trim: true
        },
        description: {
            type: String,
            trim: true,
            default: ''
        },
        img: {
            type: String,
            trim: true,
            default: ''
        },
        alpha3Code: {
            type: String,
            required: [true, 'Alpha3Code is required.'],
            uppercase: true,
            trim: true
        },
        discriminationProtection: {
            type: String,
            required: [true, 'Discrimination protection is required.'],
            trim: true
        },
        violenceCriminalization: {
            type: String,
            required: [true, 'Violence criminalization is required.'],
            trim: true
        },
        goodPlaceToLive: {
            type: String,
            required: [true, 'Good place to live is required.'],
            trim: true
        },
        transgenderLegal: {
            type: String,
            required: [true, 'Transgender legal is required.'],
            trim: true
        },
        transMurderRates: {
            type: Number,
            required: [true, 'Transgender murder rates is required.'],
            trim: true
        },
        illegalSameSexRelationships: {
            type: Boolean,
            required: [true, 'Ilegal same sex relationships is required.'],
            trim: true
        },
        propaganda: {
            type: Boolean,
            required: [true, 'Propaganda is required.'],
            trim: true
        },
        safetyIndex: {
            type: Number,
            required: [true, 'Safety index is required.'],
            trim: true
        },
        score: {
            type: String,
            required: [true, 'score is required.'],
            trim: true
        },
        comments: [{
            ref: 'comment',
            type: Schema.Types.ObjectId
        }],
    },
    {
        timestamps: true
    }
);

const Country = model("country", countrySchema);

module.exports = Country;
