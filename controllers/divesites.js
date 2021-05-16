const Divesite = require('../models/divesite');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
    const divesites = await Divesite.find({});
    res.render('divesites/index', { divesites })
}

module.exports.renderNewForm = (req, res) => {
    res.render('divesites/new');
}

module.exports.createDivesite = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.divesite.location,
        limit: 1
    }).send()
    const divesite = new Divesite(req.body.divesite);
    divesite.geometry = geoData.body.features[0].geometry;
    divesite.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    divesite.author = req.user._id;
    await divesite.save();
    console.log(divesite);
    req.flash('success', 'Successfully made a new divesite!');
    res.redirect(`/divesites/${divesite._id}`)
}

module.exports.showDivesite = async (req, res) => {
    const divesite = await Divesite.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!divesite) {
        req.flash('error', 'Cannot find that divesite!');
        return res.redirect('/divesites');
    }
    res.render('divesites/show', { divesite });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const divesite = await Divesite.findById(id)
    if (!divesite) {
        req.flash('error', 'Cannot find that divesite!');
        return res.redirect('/divesites');
    }
    res.render('divesites/edit', { divesite });
}

module.exports.updateDivesite = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const divesite = await Divesite.findByIdAndUpdate(id, { ...req.body.divesite });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename}));
    divesite.images.push(...imgs);
    await divesite.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await divesite.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully updated divesite.');
    res.redirect(`/divesites/${divesite._id}`)
}

module.exports.deleteDivesite = async (req, res) => {
    const { id } = req.params;
    await Divesite.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted divesite')
    res.redirect('/divesites');
}