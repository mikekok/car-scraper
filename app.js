// Modules
const express = require('express')
const request = require('request')
const cheerio = require('cheerio')
const path = require('path')
const fs = require('fs')

// Init App
var app = express()

// Launch Server
app.listen(3000, function() {
    console.log('Server listening on port 3000...')
})

// Get Static HTML Source and Scrape Content
var url = 'https://www.car.gr/9563417-honda-insight-1-3hybrid-book-elegance-cvt' // Sample URL
request(url, function(err, res, body) {
    var $ = cheerio.load(body)
    // Name
    var name = $('span[itemprop=name]').text().trim()
    // Price
    var price = $('span[itemprop=price]').text().trim()
    // Description
    var description = $('p[itemprop=description]').text().trim()
    // Owner
    var owner = $('td[itemprop=givenName]').text().trim()
    if (!owner) {
        owner = $('table[itemprop=automotivebusiness]').find('tr').first().text().trim()
    }
    // Phone
    var phone = $('table').first().find('td').last().find('img').attr('src')
    var phone_msg = 'saved into phones folder'
    if(phone){
        phone = phone.replace('data:image/gif;base64,', '')
        fs.writeFile(path.join(__dirname, 'phones/' + owner + '.png'), new Buffer(phone, "base64"), function(err) {})
    } else {
        phone = $('table').first().find('td').last().text().trim()
        phone_msg = phone
    }

    // Log Results
    console.log('Name: %s\nPrice: %s\nOwner: %s\nDescription: %s\nPhone: %s', name, price, owner, description, phone_msg)
})
