function parseUnitList() {
    var doc = DocumentApp.getActiveDocument();
    var body = doc.getBody();
    var text = body.getText();
    var lines = text.split("\n");

    var units = [];

    for (var i = 0; i < lines.length; i++) {
        var line = lines[i].trim();
        if (line.startsWith("Kapitel")) {
            var parts = line.split(":");
            var unit_id = parts[0].trim().split(" ")[1];
            var title = parts[1].trim();
            var unit = {
                unit_id: unit_id,
                unit_frgn_prefix: "Kapitel",
                title: title,
            };
            units.push(unit);
        }
    }

    var json = JSON.stringify(units, null, 2);
    Logger.log(json);
}
