import LocalizedStrings from 'react-localization';
import { FETCH_LOCALIZATION } from '../actions/types';

const initialState = {
	"loaded": false,
    "projectSettings": new LocalizedStrings({
		"en": {
			"addMany": "Add Many",
			"addTask": "Add Task",
			"addUser": "Add User",
			"allowClaimUnassignedTasks": "Allow transcribers to claim unassigned tasks",
			"assignedTo": "Assigned To",
			"audioFile": "Audio File",
			"autoSyncParatext": "Auto-sync with Paratext",
			"browseForProject": "Browse for a project",
			"chooseALanguage": "Choose a language",
			"clickToPair": "Click to pair with Paratext",
			"createEmptyProject": "Create empty project",
			"delete": "Delete",
			"heading": "Heading",
			"lookForProjects": "Looking for Paratext projects on this computer...",
			"next": "Next",
			"noProjectsFound": "We didn\u2019t find any Paratext projects on your computer.",
			"otherProjects": "Other Projects",
			"pairedWithParatextProject": "Paired with Paratext project",
			"people": "People",
			"privileges": "Privileges",
			"projectName": "Project Name",
			"projectSettings": "Project Settings",
			"reference": "Reference",
			"selectProject": "Select a Paratext Project",
			"sortByPrivileges": "Sort by privileges",
			"sortByType": "Sort by type",
			"taskDetails": "Task Details",
			"tasks": "Tasks",
			"userDetails": "User Details",
		}
	}),
    "transcriber": new LocalizedStrings({
		"en": {
			"accept": "Accept",
			"assigned": "Assigned",
			"available": "Available",
			"bible": "Bible",
			"congratulations": "Congratulations",
			"continue": "Continue",
			"other": "Other",
			"review": "Review",
			"storybook": "Storybook",
			"submit": "Submit",
			"test": "Test",
			"transcribe": "Transcribe",
			"unassign": "Unassign",
			"upload": "Upload",
		}
    }),
    "userSettings": new LocalizedStrings({
		"en": {
			"chooseAvatar": "Choose an image file",
			"english": "English",
			"fastForward": "Fast Forward",
			"fastForwardErrorMessage": "Please fill in the Fast Forward",
			"font": "Font",
			"fontErrorMessage": "Please fill in the Font",
			"keyboardShortcuts": "Keyboard Shortcuts",
			"language": "Language",
			"large": "Large",
			"medium": "Medium",
			"name": "Name",
			"nameErrorMessage": "Please fill in the Name",
			"password": "Password",
			"playPause": "Play / Pause",
			"playPauseErrorMessage": "Please fill in the Play/Pause",
			"reset": "Reset to Defaults",
			"reviewComments": "Review Comments",
			"reviewer": "Reviewer",
			"rewind": "Rewind",
			"rewindErrorMessage": "Please fill in the Rewind",
			"role": "Role",
			"save": "Save",
			"slowDown": "Slow Down",
			"slowDownErrorMessage": "Please fill in the Slow Down",
			"small": "Small",
			"speedUp": "Speed Up",
			"speedUpErrorMessage": "Please fill in the Speed Up",
			"transcriber": "Transcriber",
			"user": "User",
		}
	}),
};

export default function (state = initialState, action: any) {
    switch (action.type) {
        case FETCH_LOCALIZATION:
            return {
				"loaded": true,
				"projectSettings" : new LocalizedStrings(action.payload.data.projectSettings),
				"transcriber" : new LocalizedStrings(action.payload.data.transcriber),
				"userSettings" : new LocalizedStrings(action.payload.data.userSettings),
            };
        default:
            return state;
    }
}
