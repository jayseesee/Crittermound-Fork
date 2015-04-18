
$(document).ready(function () {

    setInterval(function () {
        Tipped.create('.tipped', { position: 'bottom', behavior: 'hide', radius: false, showDelay: 25, fadeIn: 0, fadeOut: 0, hideOthers: true });
        $(".tipped").bind('destroyed', function () {
            Tipped.remove($(this));
        });
        $(".tipped").removeClass("tipped");
    }, 500);

    (function ($) {
        $.event.special.destroyed = {
            remove: function (o) {
                if (o.handler) {
                    o.handler.apply(this, arguments);
                }
            }
        }
    })(jQuery)

    gameFormatNumber = function (number) {
        if (number == undefined) return 'undefined';
        if (typeof (number) === 'function') {
            return number().toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    ko.bindingHandlers['class'] = {
        'update': function (element, valueAccessor) {
            if (element['__ko__previousClassValue__']) {
                $(element).removeClass(element['__ko__previousClassValue__']);
            }
            var value = ko.utils.unwrapObservable(valueAccessor());
            $(element).addClass(value);
            element['__ko__previousClassValue__'] = value;
        }
    };

    $("table.critter > tbody").unbind("click").on("click", "tr.critterRow", function (e) {
        if (e.shiftKey) {
            game.Lock(ko.dataFor(this));
        } else {
            game.Select(ko.dataFor(this));
        }
    });

    $("table.map > tbody").unbind("click").on("click", "tr > td.fog.unlocked", function (e) {
        game.MapSelect(ko.dataFor(this));
    });

    var shifted = false;
    $(document).on('keyup keydown', function (e) {
        if ((e.shiftKey || e.ctrlKey) && !shifted) {
            $("button.female.one").hide();
            $("button.male.one").hide();
            if (game.isHeirsUnlocked()) $("button.female.two").show();
            if (game.isHeirsUnlocked()) $("button.male.two").show();
            $("button.mine").text("all workers");
            $("button.army").text("all soldiers");
            $("button.recycle").text("sacrifice all");
            shifted = true;
        }

        if (!e.shiftKey && !e.ctrlKey && shifted) {
            $("button.female.one").show();
            $("button.male.one").show();
            $("button.female.two").hide();
            $("button.male.two").hide();
            $("button.mine").text("workers");
            $("button.army").text("soldiers");
            $("button.recycle").text("sacrifice");
            shifted = false;
        }
    });


});

function Reset() {
    var result = confirm("Are you sure you want to start over?");
    if (result == true) {
        localStorage.clear();
        location.reload();
    }
}

function Export() {
    $("#txtExport").val(game.Save());
    $("#txtExport").select();
    $("#export").modal({ close: true });
}

function ShowImport() {
    $("#txtImport").val("");
    $("#import").modal({ close: true });
}

function Import() {
    game.Load($("#txtImport").val());
    $("#txtImport").val("");
}