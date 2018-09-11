'use strict'

require('dotenv').config()
const vision = require('@google-cloud/vision');
const fs = require('fs')
const rimraf = require('rimraf')
const atob = require('atob')

if (!fs.existsSync('../fotos')) {
    fs.mkdirSync('../fotos')
}

const logic = {
    _title: null,


    saveFile(base64) {
        this._title = `file-${Math.random()}.jpeg`
        console.log(base64)
        var buff = new Buffer(base64
            .replace(/^data:image\/(png|gif|jpeg);base64,/, ''), 'base64');
        fs.writeFileSync(`fotos/${this._title}`, buff)
        return this._title
    },

    googlevision(_title) {
        const client = new vision.ImageAnnotatorClient();
        const puntverd = ['wood', 'flowerpot', 'tool', 'pen', 'drinkware', 'auto part', 'clothes hanger',
            'toy', 'frying part', 'vase', 'cookware and bakeware', 'cuttery', 'radiography', 'home appliance',
            'fluorescent', 'circle', 'tire', 'dishware', 'cable', 'hardware', 'mirror', 'bag', 'furniture',
            'photograf album', 'electronic device', 'electronic accesory', 'pipe', 'highliting']

        let exist = false
        return client
            .labelDetection(_title)
            .then(results => {
                const labels = results[0].labelAnnotations
                let description = labels.map(label => label.description)
                return description
            })
            .then(description => {
                var container = ''
                for (let i = 0; i < description.length; i++) {
                    console.log(description[i])
                    switch (description[i]) {
                        case 'can':
                        case 'plastic':
                        case 'plastic bottle':
                        case 'aluminum can':
                            container = 'plastic'
                            break;
                        case 'glass':
                        case 'glass bottle':
                            container = 'vidre'
                            break;
                        case 'food':
                            container = 'marro';
                            break;
                        case 'carton':
                        case 'paper':
                            container = 'paper';
                            break;
                        default:
                            for (let j = 0; j < puntverd.length; j++) {
                                if (description[i] === puntverd[j]) {
                                    exist = true
                                }
                            }
                            if (exist === true) {
                                container = 'punt verd'
                            }
                    }
                }
                if (container === '') {
                    return ('rebuig')
                } else {
                    return (container)
                }
            })
            .catch(err => err)
    },


    
    removefolder(path) {
        const path='../fotos'
        fs.rmdirSync(path)
    }

}

module.exports = logic