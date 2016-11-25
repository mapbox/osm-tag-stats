'use strict';

var fs = require('fs');
var ff = require('feature-filter');
var featureCollection = require('turf-featurecollection');

/**
 * Filters the OSM features in a single tile based on given filter.
 * @module
 * @type {number}
 */
module.exports = function (data, tile, writeData, done) {
    var streetNames = ["Acharya Dr Sarvepalli Radhakrishnan Road","Thimmaiah Road","Kempegowda Road","Abdul Kalam Road","Viswanath Nagenhalli Main Road","Shamanna Gowda Road","Krishnananda Road","Davis Road","Pillanna Garden","Harris Road","Robertson Road","Haines Road","Netaji Road","Coles Park","Moore Road","Spencer Road","Saunders Road","Coles Road","Achutharaya Mudaliar Road","Madhavaraya Mudaliar Road","Lazer Road - Netaji Road","Viviani Road","Clarke Road","Cookson Road","Stephens Road","Bourdillon Road","Kenchappa Road","Ahmed Sait Road","Cleveland Road","Wheeler Road","Seppings Rd","Narayan Pillai Street","Kamaraj Road","Annaswamy Mudaliar Road","Lazar Road","Ashoka Road","DaCosta Square","Cline Road","Lloyd Road","Lewis Road","McPherson Road","Websters Road","Sundaramurthi Road","Carleston Road","Milton Street","Charles Campbell Road","Ramakrishna Road","PSK Naidu Road","Kensington Road","Kanakadasa Road","Sri R. Nanjundappa Road","Nehru Road","Kullappa Circle","Indira Street","Buddha Street","Viswesvariah Road","Raqavappa Road","Suranjandas Road","Swamy Vivekananda Road (Old Madras Road)","Rukshana Lakshman Avenue","B.A Basith Road","Swamy Vivekananda Road","Ibrahim Sahib Street","Karim Khan Road","MS Ramaiah Road","Nanjappa Circle","Kuvempu Circle","B Srinivas Murthy Road","Mohan Kumar Road","Siddhaiah Puranik Road","Chord Road(D. R Bendre Road)","B. Narayana Swamappa Road","Rahman Khan Road","CV Raman Road","M S Ramaiah Road","Dr Rajkumar Road","Dr. Rajkumar Road","Mahakavi Kuvempu Road","Devaiah Park","17th Main (S. Nijalingappa Road)","Bashyam Circle","Bandi Reddy Circle","D Rajgopal Road","CNR Rao Underpass","M.P.L. Sastry Road","Dr. G. Raghava Road","Jeevaraj Alva Road","Mekhri Circle","Sankey Tank Road","Bashayam Circle","CV Raman Avenue","Ramana Maharshi Road","H. V. Nanjundayya Road.","Devaiah Park Overbridge","Sidhdhavanahalli Krishnasharma Road","Kranthikavi Sarvagnya Road","Rajiv Gandhi Circle","Acharya Govind Vittal Bhave Road","T Chowdiah Road","Chowdiah Road","V S Raju Road","N. S. Iyengar Street","Nehru Circle","Vishwanath Rao Road","Yamuna Bai Road","Poorna Prasad Road","Pemme Gowda Road","MV Jayaram Road","M V Jayaram Road","Millers Road","Cunningham Road","Devaraj Urs Road","Ali Asker Road","Jasma Devi Baham Road","Hazrat Kambal Posh Road","Munniswamy Road","Dr B R Ambedkar Veedhi","Venkataswamy Naidu Road","Venkatappa Road","Shivaji Road","Balappa Garden","Cockburn Road","Dr. Ambedkar Road","Vatal Nagaraj Road","Ali Askar Road","Dr B.R .Ambedkar Veedhi","Chandrappa Circle","Srinivasiah Road","Rangaswamy Road","Krishna Garden ","Gokhale Road","Chandrashekhar Road","Mahatma Gandhi Road","Dr. M H Marigowda Road","Dickenson Road","Cubbon Road","Kamaraja Road Circle","FM Cariappa Road (Residency Road)","Thiru Valluvar Circle","Neelakantan Circle","Aga Abbas Ali Road","Richmond Road","Curley Street","DSouza Circle","Mother Teresa Road","Brunton Road","Ashley Park Road","Rathna Avenue","Victoria Road","Thyagi Palanivelu Road","Linden Street","Bhaskaran Road","Haudin Road","Murphy Road","Thamarai Kannan Road","B.M.Shri Circle","Paramahansa Yogananda Road","Obamma Lane","Bhagat Singh Main Road","Sankar Nag Road","Boothiah Lane","Ramaiah Lane","Shamannah Lane","Muniyathappa Lane","Shamannah Garden","Rashtrakavi Kuvempu Circle","M Viswesvaraya Road","Veerappa Reddy Lane","Aa Na Krishnaraya Road","DVG Road","Rashtrakavi Kuvempu Road","Jawaharlal Nehru Road","Venkatesh Murthy Road","MLA Ravisubramanya road","Aralu Mallige Parthsarathy Road","Kengel Hanumanthiah Road","C J Venkatesa Das Road","Puttalingaiah Road","T Thimmiah Road","Sheshadri Road","Gubbi Thotadappa Road","Obaiah Lane","T.C.M. Royan Road","Pandurangaswamy Lane","Pampa Mahakavi Road","Poorna Venkata Rao Road","Ananda Rao Circle","W H Hanumanthappa Road","R Subbanna Circle","Kempe Gowda Road","Kalidasa Road","Sri Y. Ramachandra Road","Lakshmana Rao Road","B.V.K. Iyengar Road","Arcot Sreenivaschar Street","Mari Munianna Lane","Sethu Rao Road","Krishna Rajendra Road","Nawab Hyder Ali Road","Narasimharaja Road","Annadanappa Lane","Sanjeevappa Lane","Pillappa Lane","Kemapanna Lane","Siddanna Lane","Krishna Singh Lane","K.M. Naganna Road","Sadar Patrappa Road","Gollar Ganganan Lane","Usman Khan Road","Pehalwan Krishnappa Road","Royan Circle","Puttanna Chetty Road","KR Road","Krishna Rajendra Circle","Shyamaraja Iyengar Road","DV Gundappa Road","Govindappa Road","Koteshwara Road","Tagore Circle","Puttana Road","Kondaji Basappa Road","Arumugam Mudaliar Road","Nawab Hyder Ali Khan Road","Sajjan Rao Road","Sajjan Rao Circle","Basappa Circle","JC Road","H Siddaiah Road","Susheela Road","Krumbiegal Road","H Siddiah Circle","Krumbigal Road","Kavi Lakshmisha Road","Krishna Rao Road","B P Wadia Road","Krishna Rao Park Walk Trail","Madhava Rao Circle","Ashoka Pillar Circle","K R Circle","Gopala Gowda Circle","Police Thimmaya Circle","Kasturba Road","Hudson Circle","Babboor Giddanna Road","Subbaiah Circle","Mission Road (Kalinga Rao Road)","Rajaram Mohan Roy Road","Vittal Mallya Road","T. Nanjundappa Road","Muniswamappa Road","Anil Kumble Circle","Lavelle Road","Sri. M. L. Subbaraju Rd.","Lady Curzon Road","Subbaraju Road","Pappana Street","Richmond Circle","Cornwell Road","D\' Souza Road","Hayes Road","Rhenius Street","O\'Shaungnessy Road","Prof Ashirvadam Junction","Albert Street","Shoolay Circle","H. Siddiah Road","Kengal Hanumanthaiah Circle (Lalbagh Circle)","Shanti Road","Swati Road","Lakshmi Road","Siddaiah Road","Langford Road (Kadidal Manjappa Road)","Basappa Road","Nanjappa Road","Berlie Street","Norris Road","Walker Lane","Setlur Street","Nettakallappa Circle","Nagasandra Circle, Basavanagudi","Arumugam Circle","Madavan Park, Jayanagara 3Rd Block","Rani Sarla Devi Circle","Aurobindo Circle","G R Vishwanath Underpass"];
    var filter = (mapOptions.tagFilter) ? ff(mapOptions.tagFilter) : false;
    var layer = data.osm.osm;
    var osmID = (mapOptions.count) ? [] : null;
    var dates = Boolean(mapOptions.dates) ? parseDates(mapOptions.dates) : false;
    var users = mapOptions.users;
    var result = layer.features.filter(function (val) {
        if ((!users || (users && users.indexOf(val.properties['@user']) > -1)) && (
            !mapOptions.dates || (mapOptions.dates && val.properties['@timestamp'] && val.properties['@timestamp'] >= dates[0] && val.properties['@timestamp'] <= dates[1])) && (!filter || (filter && filter(val)))) {
            var properties = Object.keys(val.properties);
            if (val.properties.highway && val.geometry.type === 'LineString') {
                for (var p = 0; p < properties.length; p++) {
                   if((/name*/.test(properties[p])) && (streetNames.indexOf(val.properties[properties[p]]) > -1)) {
                      return true;
                   }
                }
            }
        }
    });

    if (mapOptions.tmpGeojson && result.length > 0) {
        var fc = featureCollection(result);
        fs.appendFileSync(mapOptions.tmpGeojson, JSON.stringify(fc) + '\n');
    }
    done(null, osmID);
};

/**
 @function parseDates
 @description Convert Date to timestamp. If endDate is not present, it is set as next immediate date to startDate.
 @param {string[]} strings
 @return {number[]}
 */
function parseDates(dates) {
    var startDate = new Date(dates[0]);
    var endDate = new Date(dates[dates.length - 1]);
    if (dates.length === 1) {
        endDate.setDate((endDate.getDate() + 1));
    }
    //_timestamp in QA tiles is in seconds and not milliseconds
    return [(startDate.getTime() / 1000), (endDate.getTime() / 1000)];
}
