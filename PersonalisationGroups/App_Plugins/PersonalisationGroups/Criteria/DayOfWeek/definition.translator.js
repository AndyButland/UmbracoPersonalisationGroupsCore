export function translate(definition) {
	var translation = "";
	if (definition) {
		const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
		const selectedDays = JSON.parse(definition);

		for (let i = 0; i < selectedDays.length; i++) {
			if (translation.length > 0) {
				translation += ", ";
			}

			translation += days[selectedDays[i] - 1];
		}
	}

	return translation;
}