const aws = require('aws-sdk');
const fs = require('fs');

let secrets;
if (process.env.NODE_ENV == 'production') {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require('./secrets'); // in dev they are in secrets.json which is listed in .gitignore
}

const ses = new aws.SES({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
    region: 'eu-central-1'
});

const s3 = new aws.S3({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET
});

exports.sendEmail = function (recipient, message, subject) {

    return ses
        .sendEmail({
            Source: "Social project <hsolbergeriksen@gmail.com>",
            Destination: {
                ToAddresses: [recipient],
            },
            Message: {
                Body: {
                    Text: {
                        Data: message
                    },
                },
                Subject: {
                    Data: subject,
                },
            },
        })
        .promise()
        .then(() => console.log("it worked!"))
        .catch((err) => console.log(err));

};

exports.upload = (req, res, next) => {
    if (!req.file) {
        return res.sendStatus(500);
    }

    // this gives you additional info about the file you just uploaded
    const { filename, mimetype, size, path } = req.file;

    const promise = s3.putObject({
        Bucket: 'pulse-today', //spicedling if you're using spiced's credentials
        ACL: 'public-read',
        Key: filename,
        Body: fs.createReadStream(path),
        ContentType: mimetype,
        ContentLength: size
    }).promise();

    promise.then(
        () => {
            // it worked!!!
            console.log('amazon upload is complete!!!');
            next();
            // this will delete the img you just uploaded to aws from uploads folder - this is optional!
           // fs.unlink(path, () => {});
        }
    ).catch(
        err => {
        // uh oh
            console.log(err);
        }
    );
};