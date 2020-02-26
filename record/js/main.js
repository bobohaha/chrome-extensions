$(document).ready(function () {
    chrome.storage.local.get(null, function (item) {
        if (!item.jmxName) {
            item.jmxName = generateJmxName();
            chrome.storage.local.set({"jmxName": item.jmxName});
        }
        $("#jmx_name").val(item.jmxName);

        if (!item.options) {
            let options = {};
            options.requests_to_record = 'top_level';
            options.record_ajax = true;
            options.functional_test = false;
            options.cookie = true;
            options.record_css = false;
            options.record_js = false;
            options.record_images = false;
            options.record_other = false;
            options.cache = true;
            options.regex_include = 'http://*/*, https://*/*';
            options.useragent = 'Current Browser';
            //options
            chrome.storage.local.set({"options": options});
        }

        if (!item.recordData) {
            item.recordData = [];
            chrome.storage.local.set({"recordData": item.recordData});
        }

        if (item.isRecording) {
            $('#record_download').hide();
            $('#record_stop').show();
            $('#record_start').hide();
        } else {
            if (item.recordData.length > 0) {
                $('#record_download').show();
            } else {
                $('#record_download').hide();
            }
            $('#record_stop').hide();
            $('#record_start').show();
        }
    });
});

$("#jmx_name").change(e => {
    chrome.storage.local.set({"jmxName": $(" #jmx_name ").val()});
});


$('#record_start').click(e => {
    $('#record_download').hide();
    $('#record_stop').show();
    let bg = chrome.extension.getBackgroundPage();
    bg.startRecording();
    $('#record_start').hide();
});

$('#record_stop').click(e => {
    $('#record_download').show();
    let bg = chrome.extension.getBackgroundPage();
    bg.stopRecording();
    $('#record_start').show();
    $('#record_stop').hide();
});


$('#record_download').click(e => {
    chrome.storage.local.get(null, function (item) {
        let jmx = new Jmx(item.recordData, item.jmxName);
        let blob = new Blob([jmx.generate()], {type: "application/octet-stream"});
        let link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = item.jmxName + ".jmx";
        link.click();
        window.URL.revokeObjectURL(link.href);
    });
});


function generateJmxName() {
    let d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear(),
        hour = d.getHours(),
        min = d.getMinutes();


    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;
    if (hour.length < 2)
        hour = '0' + hour;
    if (min.length < 2)
        min = '0' + min;

    return ["RECORD", year, month, day, hour, min].join('-');
}
