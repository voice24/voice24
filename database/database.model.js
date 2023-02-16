// var insert = function (collectionName, newDocument) {
//     return new Promise(async function (resolve, reject) {
//         try {
//             let newObj = new collectionName(newDocument);
//             console.log(newObj);
//             const post = await newObj.save();
//             return resolve(post);
//         } catch (error) {
//             console.log(
//                 `[${collectionName}] Error creating new documents: ${error}`,
//             );
//             return reject(error);
//         }
//     });
// };

const insert = async (collectionName, newDocument) => {
    try {
        let newObj = new collectionName(newDocument);
        console.log(newObj);
        const post = await newObj.save();
        return post;
    } catch (error) {
        console.log(
            `[${collectionName}] Error creating new documents: ${error}`,
        );
        return error;
    }
};

const remove = async (collectionName, key) => {
    try {
        const post = await collectionName.findOneAndRemove(key).exec();
        return post;
    } catch {
        console.log(`[${collectionName}] Error removing document: ${error}`);
        return error;
    }
};

// var remove = function (collectionName, key) {
//     return new Promise(async function (resolve, reject) {
//         try {
//             const post = await collectionName.findOneAndRemove(key).exec();
//             return resolve(post);
//         } catch (error) {
//             console.log(
//                 `[${collectionName}] Error removing document: ${error}`,
//             );
//             return reject(error);
//         }
//     });
// };

const find = async (collectionName, key = {}, populate = false, lmt = 0) => {
    try {
        let post = null;
        if (populate) {
            let cnt = await collectionName.find().count();
            if (lmt === 0) {
                lmt = cnt;
            }
            post = await collectionName
                .find(key)
                .populate("createdBy", "_id name")
                .sort("-createdAt")
                .limit(lmt)
                .exec();
            // console.log(cnt);
        } else {
            post = await collectionName
                .find(key)
                .sort("-createdAt")
                .limit(9)
                .exec();
        }
        return post;
    } catch (error) {
        console.log(
            `[${collectionName}] Error creating new documents: ${error}`,
        );
        return error;
    }
};

// var find = async function (
//     collectionName,
//     key = {},
//     populate = false,
//     lmt = 0,
// ) {
//     return new Promise(async function (resolve, reject) {
//         try {
//             let post = null;
//             if (populate) {
//                 let cnt = await collectionName.find().count();
//                 if (lmt === 0) {
//                     lmt = cnt;
//                 }
//                 post = await collectionName
//                     .find(key)
//                     .populate("createdBy", "_id name")
//                     .sort("-createdAt")
//                     .limit(lmt)
//                     .exec();
//                 console.log(cnt+"cnt");
//             } else {
//                 post = await collectionName
//                     .find(key)
//                     .sort("-createdAt")
//                     .limit(9)
//                     .exec();
//             }
//             return resolve(post);
//         } catch (error) {
//             console.log(
//                 `[${collectionName}] Error creating new documents: ${error}`,
//             );
//             return reject(error);
//         }
//     });
// };

const findOne = async (collectionName, key) => {
    try {
        const post = await collectionName.findOne(key).exec();
        return post;
    } catch (error) {
        console.log(
            `[${collectionName}] Error creating new documents: ${error}`,
        );
        return error;
    }
};

// var findOne = function (collectionName, key) {
//     return new Promise(async function (resolve, reject) {
//         try {
//             const post = await collectionName.findOne(key).exec();
//             return resolve(post);
//         } catch (error) {
//             console.log(
//                 `[${collectionName}] Error creating new documents: ${error}`,
//             );
//             return reject(error);
//         }
//     });
// };

const findById = async (collectionName, documentId, populate = false) => {
    try {
        let post = null;
        if (populate) {
            post = await collectionName
                .findById(documentId)
                .populate("createdBy", "_id name")
                .exec();
        } else {
            post = await collectionName.findById(documentId).exec();
        }
        return post;
    } catch (error) {
        console.log(
            `[${collectionName}] Error creating new documents: ${error}`,
        );
        return error;
    }
};
// var findById = function (collectionName, documentId, populate = false) {
//     return new Promise(async function (resolve, reject) {
//         try {
//             let post = null;
//             if (populate) {
//                 post = await collectionName
//                     .findById(documentId)
//                     .populate("createdBy", "_id name")
//                     .exec();
//             } else {
//                 post = await collectionName.findById(documentId).exec();
//             }
//             return resolve(post);
//         } catch (error) {
//             console.log(
//                 `[${collectionName}] Error creating new documents: ${error}`,
//             );
//             return reject(error);
//         }
//     });
// };

const findByIdAndRemove = async (collectionName, documentId) => {
    try {
        const post = await collectionName.findByIdAndRemove(documentId).exec();
        return post;
    } catch (error) {
        console.log(
            `[${collectionName}] Error creating new documents: ${error}`,
        );
        return error;
    }
};

// var findByIdAndRemove = function (collectionName, documentId) {
//     return new Promise(async function (resolve, reject) {
//         try {
//             const post = await collectionName.findByIdAndRemove(documentId).exec();
//             return resolve(post);
//         } catch (error) {
//             console.log(`[${collectionName}] Error creating new documents: ${error}`);
//             return reject(error);
//         }
//     });
// };

const findByIdAndUpdate = async (collectionName, documentId, newDocument) => {
    try {
        const post = await collectionName
            .findByIdAndUpdate(documentId, newDocument)
            .exec();
        return post;
    } catch (error) {
        console.log(
            `[${collectionName}] Error creating new documents: ${error}`,
        );
        return error;
    }
};

// var findByIdAndUpdate = function (collectionName, documentId, newDocument) {
//   return new Promise(async function (resolve, reject) {
//     try {
//       const post = await collectionName
//         .findByIdAndUpdate(documentId, newDocument)
//         .exec();
//       return resolve(post);
//     } catch (error) {
//       console.log(`[${collectionName}] Error creating new documents: ${error}`);
//       return reject(error);
//     }
//   });
// };

const findByIdAndUpdateElement = async (
    collectionName,
    documentId,
    updateQuery,
    populate = false,
) => {
    try {
        let post = null;
        if (populate) {
            post = await collectionName
                .findByIdAndUpdate(documentId, updateQuery, { new: true })
                .populate("createdBy", "_id name")
                .exec();
        } else {
            post = await collectionName
                .findByIdAndUpdate(documentId, updateQuery, { new: true })
                .exec();
        }
        return post;
    } catch (error) {
        console.log(`[${collectionName}] Error updating documents: ${error}`);
        return error;
    }
};

// var findByIdAndUpdateElement = function (
//     collectionName,
//     documentId,
//     updateQuery,
//     populate = false,
// ) {
//     return new Promise(async function (resolve, reject) {
//         try {
//             let post = null;
//             if (populate) {
//                 post = await collectionName
//                     .findByIdAndUpdate(documentId, updateQuery, { new: true })
//                     .populate("createdBy", "_id name")
//                     .exec();
//             } else {
//                 post = await collectionName
//                     .findByIdAndUpdate(documentId, updateQuery, { new: true })
//                     .exec();
//             }
//             return resolve(post);
//         } catch (error) {
//             console.log(
//                 `[${collectionName}] Error updating documents: ${error}`,
//             );
//             return reject(error);
//         }
//     });
// };

const findLastInserted = async (collectionName) => {
    try {
        const post = await collectionName
            .find()
            .sort({ _id: -1 })
            .limit(1)
            .exec();
        return post;
    } catch (error) {
        console.log(
            `[${collectionName}] Error creating new documents: ${error}`,
        );
        return error;
    }
};

// var findLastInserted = function (collectionName) {
//     return new Promise(async function (resolve, reject) {
//         try {
//             const post = await collectionName
//                 .find()
//                 .sort({ _id: -1 })
//                 .limit(1)
//                 .exec();
//             return resolve(post);
//         } catch (error) {
//             console.log(
//                 `[${collectionName}] Error creating new documents: ${error}`,
//             );
//             return reject(error);
//         }
//     });
// };

const likePost = async (collectionName, PostId, user) => {
    try {
        const post = await collectionName
            .findByIdAndUpdate(
                PostId,
                {
                    $push: { likes: user },
                },
                {
                    new: true,
                },
            )
            .exec();
        return post;
    } catch (error) {
        console.log(`[${collectionName}] Error in liking documents: ${error}`);
        return error;
    }
};

// var likePost = function (collectionName, PostId, user) {
//     console.log(typeof user);
//     return new Promise(async function (resolve, reject) {
//         try {
//             const post = await collectionName
//                 .findByIdAndUpdate(
//                     PostId,
//                     {
//                         $push: { likes: user },
//                     },
//                     {
//                         new: true,
//                     },
//                 )
//                 .exec();
//             return resolve(post);
//         } catch (error) {
//             console.log(
//                 `[${collectionName}] Error in liking documents: ${error}`,
//             );
//             return reject(error);
//         }
//     });
// };

// module.exports.remove = remove;
// module.exports.insert = insert;
// module.exports.find = find;
// module.exports.findOne = findOne;
// module.exports.findById = findById;
// module.exports.findByIdAndRemove = findByIdAndRemove;
// module.exports.findByIdAndUpdate = findByIdAndUpdate;
// module.exports.findLastInserted = findLastInserted;
// module.exports.findByIdAndUpdateElement = findByIdAndUpdateElement;
// module.exports.likePost = likePost;

module.exports = {
    remove,
    insert,
    find,
    findOne,
    findById,
    findByIdAndRemove,
    findByIdAndUpdate,
    findLastInserted,
    findByIdAndUpdateElement,
    likePost,
};
