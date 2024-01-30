function parseExercise() {
    var doc = DocumentApp.getActiveDocument();
    var body = doc.getBody();
    var elements = body.getNumChildren();

    var parsedData = {
        exercise_id: "",
        title: "",
        instructions: "",
        example: null,
        questions: [],
        section_id: "",
    };

    for (var i = 0; i < elements; i++) {
        var child = body.getChild(i);
        var element =
            child.getType() === DocumentApp.ElementType.LIST_ITEM
                ? child.asListItem()
                : child.asParagraph();
        var text = element.getText();

        if (text.toLowerCase().startsWith("exercise:")) {
            parsedData.exercise_id = text.split(" ")[1].trim();
            var sectionId = parsedData.exercise_id
                .split(".")
                .slice(0, 2)
                .join(".");
            parsedData.section_id = sectionId;
        } else if (text.toLowerCase().startsWith("title:")) {
            parsedData.title = text.split(":")[1].trim();
        } else if (text.toLowerCase().startsWith("instructions:")) {
            var instructionsTextElement = child.asParagraph().editAsText();
            parsedData.instructions = addSpansToBoldAndColoredText(
                instructionsTextElement,
                text,
            );
            parsedData.instructions = parsedData.instructions
                .split(":")[1]
                .trim();
        } else if (text.toLowerCase().startsWith("example:")) {
            parsedData.example = parseExample(body, i);
        } else if (text.toLowerCase().includes("{*multiple choice*}")) {
            break;
        }
    }

    var qElements = body.getParagraphs();
    var foundMultipleChoice = false;
    var processingQuestion = false;
    var currentQuestion = {};

    for (var i = 0; i < qElements.length; i++) {
        var qElement = qElements[i];
        var text = qElement.getText();

        if (text.toLowerCase().includes("{*multiple choice*}")) {
            foundMultipleChoice = true;
            continue;
        }

        if (foundMultipleChoice) {
            if (qElement.getType() === DocumentApp.ElementType.LIST_ITEM) {
                var listItem = qElement.asListItem();
                if (listItem.getGlyphType() === DocumentApp.GlyphType.NUMBER) {
                    if (processingQuestion) {
                        parsedData.questions.push(currentQuestion);
                    }
                    currentQuestion = {
                        question: addSpansToBoldAndColoredText(
                            qElement.asListItem().editAsText(),
                            text,
                        ),
                        choices: [],
                        correct_choice: "",
                        type: "multiple_choice",
                    };
                    processingQuestion = true;
                } else {
                    var isCorrect = text.toLowerCase().includes("{*correct*}");
                    var choiceText = text.replace(" {*correct*}", "");
                    currentQuestion.choices.push(choiceText);
                    if (isCorrect) {
                        currentQuestion.correct_choice = choiceText;
                    }
                }
            }
        }
    }

    if (processingQuestion) {
        parsedData.questions.push(currentQuestion);
    }

    Logger.log(JSON.stringify(parsedData, null, 2));
    return parsedData;
}

function parseExample(body, exampleIndex) {
    // Get the question text, which is in the paragraph after "Example:"
    var exampleQuestionElement = body
        .getChild(exampleIndex + 1)
        .asParagraph()
        .editAsText();
    var formattedQuestion = addSpansToBoldAndColoredText(
        exampleQuestionElement,
        exampleQuestionElement.getText(),
    );

    var choices = [];
    var correctChoice = "";
    var i = exampleIndex + 2; // Start from the element after the question

    while (i < body.getNumChildren()) {
        var element = body.getChild(i);
        if (element.getType() === DocumentApp.ElementType.LIST_ITEM) {
            var listItemText = element.asListItem().getText().trim();
            choices.push(listItemText);
        } else {
            // Assume the correct choice is indicated in the paragraph after the choices
            var correctChoiceText = element.asParagraph().getText().trim();
            var match = correctChoiceText.match(
                /\(correct solution:\s([a-z])\.\s(.+)\)/,
            );
            if (match) {
                correctChoice = match[2]; // Extract the correct choice text
                break; // Exit the loop after finding the correct choice
            }
        }
        i++;
    }

    return {
        question: formattedQuestion,
        choices: choices,
        correct_choice: correctChoice,
    };
}
