function parseDocument() {
    var doc = DocumentApp.getActiveDocument();
    var body = doc.getBody();
    var text = body.getText();
    var lines = text.split("\n");

    var sections = [];

    for (var i = 0; i < lines.length; i++) {
        var line = lines[i].trim();

        if (line.startsWith("Kapitel")) {
            var kapitelParts = line.split(" ");
            if (kapitelParts.length > 1) {
                var unit_id = kapitelParts[1];
            }
        }

        if (line.startsWith("Teil")) {
            var parts = line.split(":");
            var section_id = parts[0].trim().split(" ")[1];
            var title = parts[1].trim();
            var section = {
                section_id: `${unit_id}.${section_id}`,
                section_frgn_prefix: "Teil",
                title: title,
                unit_id: unit_id,
            };
            sections.push(section);
        }
    }

    var json = JSON.stringify(sections, null, 2);
    Logger.log(json);
}
