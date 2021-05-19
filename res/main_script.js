function get_icon_list() {
    // Append icons in killicon-container
    var len = Object.keys(iconlist).length; // icon list
    console.log(len);
    var f = "icons_sorted/";
    for (var i = 1; i < len + 1; i++) {
        var fname = Object.keys(iconlist[`${i}`]);
        var tags = iconlist[`${i}`][`${fname}`];
        $(".killicon-container").append(`<div class='list-item ${tags}' data-fname="${fname}"> <img class="selectable-img " src="${f}${fname}" data-fname="${fname}" alt='` + fname.toString().slice(0, -4).replace("_", " ") + `'> </div>`)
    }
}
$(document).ready(function() {
    // special_bg?
    $('#is_crit').change(function() {
        var df = $("#display-feed");
        if (this.checked) {
            df.attr("data-special-bg", 1)
            $('#is_aussie').prop('checked', false);
        } else {
            df.attr("data-special-bg", 0)
        }
    });
    // Aussie?
    $('#is_aussie').change(function() {
        var df = $("#display-feed");
        if (this.checked) {
            df.attr("data-special-bg", 2)
            $('#is_crit').prop('checked', false);
        } else {
            df.attr("data-special-bg", 0)
        }
    });
    // "Sort"
    $('.sortable').click(function() {
        var tag = $(this).attr('data-tags');
        if ($(this).attr('data-sort') == "off") {
            $(`.${tag}`).css("display", "");
            $(this).attr('data-sort', "on");
            $(this).css("background-color", "#2b793f");
        } else {
            $(`.${tag}`).css("display", "none");
            $(this).attr('data-sort', "off");
            $(this).css("background-color", "#d4232373");
        }
    })

    $('.name-input').keypress(function(e) {
        if ((e.keyCode == 10 || e.keyCode == 13) && e.shiftKey) {
            $('#kill_btn_dom').click();
        } else if (e.keyCode == 10 || e.keyCode == 13)
            $('#kill_btn').click();
    });
});
$(document).on("click", ".list-item", function() {
    // Select Kill Icon
    $('.list-item').removeClass('selected');
    var fname = $(this).attr("data-fname");
    $(this).addClass('selected');

    $("#display-feed").attr("data-icon-id", `${fname}`);
});


CanvasRenderingContext2D.prototype.roundRect = function(sx, sy, ex, ey, r) {
    // Thanks to this guy: https://stackoverflow.com/a/7838871
    // Made rounded rectangles extremely easy. 
    var r2d = Math.PI / 180;
    if ((ex - sx) - (2 * r) < 0) { r = ((ex - sx) / 2); }
    if ((ey - sy) - (2 * r) < 0) { r = ((ey - sy) / 2); }
    this.beginPath();
    this.moveTo(sx + r, sy);
    this.lineTo(ex - r, sy);
    this.arc(ex - r, sy + r, r, r2d * 270, r2d * 360, false);
    this.lineTo(ex, ey - r);
    this.arc(ex - r, ey - r, r, r2d * 0, r2d * 90, false);
    this.lineTo(sx + r, ey);
    this.arc(sx + r, ey - r, r, r2d * 90, r2d * 180, false);
    this.lineTo(sx, sy + r);
    this.arc(sx + r, sy + r, r, r2d * 180, r2d * 270, false);
    this.closePath();
}

function color_switch() {
    // switches data-colors attribute
    var df = $("#display-feed");
    if (df.attr("data-colors") == 0) {
        df.attr("data-colors", 1);
        $('.clr-show-l').css('background', '#004bff');
        $('.clr-show-r').css('background', '#c40000');
    } else {
        df.attr("data-colors", 0);
        $('.clr-show-l').css('background', '#c40000');
        $('.clr-show-r').css('background', '#004bff');
    }
}

function draw_kill(special) {
    let df = $("#display-feed");

    let ks = new Image(); // Killstreak image
    let is_ks = df.attr('data-is-ks');

    let special_bg = new Image(); // special_bg BG
    special_bg.origin = 'anonymous';

    let image = new Image(); // Kill icon
    image.origin = 'anonymous';






    let KILLER = $("#KILLER").val(); // killer name
    let VICTIM = $("#VICTIM").val(); // victim name
    let id = df.attr('data-icon-id'); // icon fname from canvas attributes




    let bg = '#F1E9CB';
    if (!$('#is_init').prop('checked')) {
        // killfeed background, changes according to
        // inititator checkbox
        bg = '#202020';
    }
    if (df.attr("data-colors") == 0) {
        // Picks color for Killer and Victim according to data-colors attribute
        var l_name_color = "#A3574A";
        var r_name_color = "#557C83";
    } else {
        var r_name_color = "#A3574A";
        var l_name_color = "#557C83";
    }



    image.src = 'icons_sorted/' + id; // icon

    let c = document.getElementById("display-feed");
    c.width = 1000;
    c.height = 80;
    let ctx = c.getContext("2d");
    // DRAW
    image.onload = function() {
        // SETUP
        let image_scale_multiplier = 1.52;
        let image_width = 0;
        if ($('#is_drawIcon').prop('checked')) {
            image_width = this.width;
        }
        image_width *= image_scale_multiplier;
        ctx.font = "bold 125% Verdana";

        let custom_offsetX = 0; // Custom offset. Includes DOMINATION.
        if (special == 1) {
            custom_offsetX = ctx.measureText("is DOMINATING").width;
        } else if (special == 2) {
            custom_offsetX = ctx.measureText($('#custom_special').val()).width;
        }

        let custom_font_clr = '#3e3923'; // Font color changes whenether initiating a kill or not
        if (!$('#is_init').prop('checked')) {
            custom_font_clr = '#F1E9CB';
        }

        let feed_len = 112 + ctx.measureText(KILLER).width + image_width + custom_offsetX + ctx.measureText(VICTIM).width; // feed length
        ks_offset = is_ks == true ? 20 : 0; // ks offset in px
        feed_len += ks_offset // if killsteak, make feed rect longer

        $('#save').attr('data-img-width', Math.ceil(feed_len));

        // DRAW RECT
        let sorta_mid = (c.width / 2) - feed_len / 2;

        ctx.roundRect(sorta_mid, 20, sorta_mid + feed_len, c.height, 6);
        ctx.strokeStyle = "#000";
        ctx.fillStyle = bg;
        ctx.fill();
        // DRAW KILLER
        ctx.fillStyle = l_name_color;
        ctx.fillText(KILLER, sorta_mid + 38, 58);
        // ICON COORDS
        let icon_offset = 40 + ks_offset;
        if ($('#is_drawIcon').prop('checked')) {
            icon_offset = 60 + ks_offset;
        }
        let destX = sorta_mid + icon_offset + ctx.measureText(KILLER).width;
        let destY = c.height / 2 - this.height / 2 + 9;
        // DRAW KILLSTREAK
        if (is_ks == true) {
            console.log('ks drawn')
            ctx.drawImage(ks, destX - ks_offset, destY);
        }
        // DRAW special_bg
        if (df.attr("data-special-bg") != "0") {
            let special_bg_scale = image_scale_multiplier + 0.7;
            ctx.globalAlpha = 0.75;
            ctx.globalCompositeOperation = "source-atop";
            ctx.drawImage(
                special_bg,
                destX + image_width / 2 - special_bg.width * special_bg_scale / 2,
                destY - 5 - (special_bg.height * special_bg_scale) / 4,
                special_bg.width * special_bg_scale,
                special_bg.height * special_bg_scale);
            ctx.globalAlpha = 1;
            ctx.globalCompositeOperation = "source-over";
        }
        // DRAW ICON
        if ($('#is_drawIcon').prop('checked')) {
            let w = this.width;
            let h = this.height;
            ctx.drawImage(this, destX, destY - h / 4, w * image_scale_multiplier, h * image_scale_multiplier);
            if (!$('#is_init').prop('checked') || special == 1) {
                // Invert the colors of kill icon, if not initiationg a kill.

                let masked_img = masked_image(this, 64, 60, 36, 255, 55, w, h, image_scale_multiplier);
                if (special == 1) {
                    masked_img = masked_image(this, 245, 229, 193, 255, 10, w, h, image_scale_multiplier);
                }
                let temp_c = document.createElement('canvas');
                temp_c.width = c.width;
                temp_c.height = c.height;
                let tmpctx = temp_c.getContext('2d');

                tmpctx.drawImage(this, destX, destY - h / 4, w * image_scale_multiplier, h * image_scale_multiplier);

                tmpctx.globalCompositeOperation = "source-in";
                tmpctx.drawImage(masked_img, destX, destY - h / 4);
                ctx.drawImage(temp_c, 0, 0);
                temp_c.delete;
            }
        }
        // DRAW SPECIAL
        if (special == 1) {
            ctx.fillStyle = custom_font_clr;
            ctx.fillText("is DOMINATING", destX + image_width + 14, 58);
        } else if (special == 2) {
            ctx.fillStyle = custom_font_clr;
            ctx.fillText($('#custom_special').val(), destX + image_width + 14, 58);
        }
        // DRAW VICTIM
        ctx.fillStyle = r_name_color;
        ctx.fillText(VICTIM, destX + image_width + custom_offsetX + ([1, 2].includes(special) ? 24 : 14), 58);
    }

    // SRC
    if (df.attr("data-special-bg") == "1") {
        special_bg.src = $(`img[data-fname='Killicon_crit.png']`).attr("src");
    } else {
        special_bg.src = $(`img[data-fname='Killicon_australium.png']`).attr("src");
    }
    if (special == 1) {
        image.src = "icons_sorted/Killicon_domination.png";
    } else {
        image.src = $(`img[data-fname='${id}']`).attr("src");
    }
    if (is_ks == true) {
        ks.src = "icons_sorted/Killstreak_Icon.png";
    }

}

function masked_image(img, r, g, b, a, precision, sw, sh, scale = 1) {
    // Returns a canvas, that contains only the color defined by
    // RGBA values in a range of (-precision, + precision).
    // Thanks to this guy: https://stackoverflow.com/a/22540439
    // I was able to rewrite parts of his code to use in this project.
    let c = document.createElement('canvas');
    c.width = sw * scale;
    c.height = sh * scale;
    ctx = c.getContext('2d');
    ctx.drawImage(img, 0, 0, sw * scale, sh * scale);

    var canvasImgData = ctx.getImageData(0, 0, c.width, c.height);
    var data = canvasImgData.data;
    for (var i = 0; i < data.length; i += 4) {
        var isInMask = (
            data[i + 0] > (r - precision) && data[i + 0] < (r + precision) &&
            data[i + 1] > (g - precision) && data[i + 1] < (g + precision) &&
            data[i + 2] > (b - precision) && data[i + 2] < (b + precision) &&
            data[i + 3] > 0
        );
        data[i + 0] = (isInMask) ? 255 : 0;
        data[i + 1] = (isInMask) ? 255 : 0;
        data[i + 2] = (isInMask) ? 255 : 0;
        data[i + 3] = (isInMask) ? 255 : 0;
    }
    ctx.putImageData(canvasImgData, 0, 0);
    return c;
}

function save() {
    let feed_len = $("#save").attr("data-img-width");
    let canvas = document.getElementById("display-feed");
    let sorta_mid = (canvas.width / 2) - feed_len / 2;
    let temp_canvas = document.createElement('canvas');
    temp_canvas.width = feed_len;
    temp_canvas.height = 80;
    tctx = temp_canvas.getContext('2d');
    tctx.drawImage(canvas, sorta_mid, 0, feed_len, 80, 0, -10, feed_len, 80);

    var link = document.createElement('a');
    link.download = 'killfeed_generated.png';
    link.href = temp_canvas.toDataURL();
    link.click();
    link.delete;
}