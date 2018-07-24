import LocalizedStrings from 'react-localization';
import { FETCH_LOCALIZATION } from '../actions/types';

const initialState = {
    "transcriber": new LocalizedStrings({
		"en": {
			"accept": "Accept",
			"assigned": "Assigned",
			"available": "Available",
			"bible": "Bible",
			"other": "Other",
			"review": "Review",
			"storybook": "Storybook",
			"submit": "Submit",
			"test": "Test",
			"transcribe": "Transcribe",        }
    }),
    "userSettings": new LocalizedStrings({
		"en": {
			"english": "English",
			"fastForward": "Fast Forward",
			"font": "Font",
			"keyboardShortcuts": "KEYBOARD SHORTCUTS",
			"language": "Language",
			"large": "Large",
			"medium": "Medium",
			"name": "Name",
			"password": "Password",
			"playPause": "Play / Pause",
			"reset": "RESET TO DEFAULTS",
			"reviewComments": "REVIEW COMMENTS",
			"reviewer": "Reviewer",
			"rewind": "Rewind",
			"role": "Role",
			"save": "Save",
			"slowDown": "Slow Down",
			"small": "Small",
			"speedUp": "Speed Up",
			"transcriber": "Transcriber",
			"user": "User",        }
    })
};

export default function (state = initialState, action: any) {
    switch (action.type) {
        case FETCH_LOCALIZATION:
            return {
                "transcriber" : new LocalizedStrings(action.payload.data.transcriber),
                "userSettings" : new LocalizedStrings(action.payload.data.userSettings),
            };
        default:
            return state;
    }
}
