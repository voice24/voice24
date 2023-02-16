const BaseResource = require("../common/base.resource");
const mongoose = require("mongoose");
const collection = mongoose.model("Post");
const dbModel = require("../database/database.model");

class PostModel extends BaseResource {
    constructor() {
        super(collection);
        this.taglist = [];
    }

    manipulate(like, view, postId) {
        return new Promise(function (resolve, reject) {
            let ml = Number(like);
            let mv = Number(view);
            dbModel
                .findByIdAndUpdateElement(
                    collection,
                    postId,
                    { ml: ml, mv: mv },
                    true,
                )
                .then((post) => {
                    return resolve(post);
                })
                .catch((error) => {
                    return reject(error);
                });
        });
    }

    getposts(lmt = 0) {
        return new Promise(function (resolve, reject) {
            dbModel
                .find(collection, { status: "approved" }, true, lmt)
                .then((result) => {
                    return resolve(result);
                })
                .catch((error) => {
                    return reject(error);
                });
        });
    }

    getArticle() {
        return new Promise(function (resolve, reject) {
            dbModel
                .find(collection, { status: "approved", mode: "post" }, true)
                .then((result) => {
                    return resolve(result);
                })
                .catch((error) => {
                    return reject(error);
                });
        });
    }

    getPostById(_id) {
        return new Promise(function (resolve, reject) {
            dbModel
                .findById(collection, _id)
                .then((result) => {
                    return resolve(result);
                })
                .catch((error) => {
                    return reject(error);
                });
        });
    }

    getHashTags() {
        const self = this;
        return new Promise(function (resolve, reject) {
            let key = {
                type: "Trending",
                status: "approved",
            };
            self.filterPost(key)
                .then((posts) => {
                    posts.forEach((post) => {
                        self.taglist.push(...post.hashtags);
                    });
                    self.taglist = self.taglist.filter(
                        (v, i, a) => a.indexOf(v) === i,
                    );
                    return resolve(self.taglist);
                })
                .catch((error) => {
                    return reject(error);
                });
        });
    }

    deletePost(postId) {
        return new Promise(function (resolve, reject) {
            dbModel
                .findByIdAndUpdateElement(
                    collection,
                    postId,
                    { status: "deteted" },
                    true,
                )
                .then((post) => {
                    return resolve(post);
                })
                .catch((error) => {
                    return reject(error);
                });
        });
    }

    filterPost(key) {
        return new Promise(function (resolve, reject) {
            dbModel
                .find(collection, key, true)
                .then((post) => {
                    return resolve(post);
                })
                .catch((error) => {
                    return reject(error);
                });
        });
    }

    // getPostsByCategory(category) {
    //     return new Promise(function (resolve, reject) {
    //         dbModel.find(collection, {category: category})
    //             .then((result) =>{
    //                 return resolve(result);
    //             })
    //             .catch((error) => {
    //                 return reject(error);
    //             })
    //     })
    // }

    // getPostsByOption(option) {
    //     return new Promise(function (resolve, reject) {
    //         dbModel.find(collection, {option: option})
    //             .then((result) =>{
    //                 return resolve(result);
    //             })
    //             .catch((error) => {
    //                 return reject(error);
    //             })
    //     })
    // }

    searchpost(userPattern) {
        return new Promise(function (resolve, reject) {
            dbModel
                .find(collection, { tag: { $regex: userPattern } })
                .then((result) => {
                    return resolve(result);
                })
                .catch((error) => {
                    return reject(error);
                });
        });
    }

    likePost(postId, userId) {
        return new Promise(function (resolve, reject) {
            dbModel
                .findByIdAndUpdateElement(
                    collection,
                    postId,
                    { $push: { likes: userId } },
                    true,
                )
                .then((post) => {
                    return resolve(post);
                })
                .catch((error) => {
                    return reject(error);
                });
        });
    }

    unLikePost(postId, userId) {
        return new Promise(function (resolve, reject) {
            dbModel
                .findByIdAndUpdateElement(
                    collection,
                    postId,
                    { $pull: { likes: userId } },
                    true,
                )
                .then((post) => {
                    return resolve(post);
                })
                .catch((error) => {
                    return reject(error);
                });
        });
    }

    viewPost(postId, views) {
        return new Promise(function (resolve, reject) {
            dbModel
                .findByIdAndUpdateElement(
                    collection,
                    postId,
                    { views: views },
                    true,
                )
                .then((post) => {
                    return resolve(post);
                })
                .catch((error) => {
                    return reject(error);
                });
        });
    }
}

module.exports.PostModel = new PostModel();
