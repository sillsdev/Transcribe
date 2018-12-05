import LocalizedStrings from 'react-localization';
import { FETCH_LOCALIZATION } from '../actions/types';

const initialState = {
	"loaded": false,
    "projectSettings": new LocalizedStrings({
		"en": {
			"addMany": "Add Many",
			"addTask": "Add Task",
			"addUser": "Add User",
			"admin": "Admin",
			"allowClaimUnassignedTasks": "Allow transcribers to claim unassigned tasks",
			"assignedTo": "Assigned To",
			"audioFile": "Audio File",
			"autoSyncParatext": "Auto-sync with Paratext",
			"batchUpload": "batch upload spreadsheet",
			"browseForProject": "Browse for a project",
			"changeImage": "Change project image",
			"chooseALanguage": "Choose a user interface language",
			"clickToPair": "Click to pair with Paratext",
			"copyToClipboard": "Copy to Clipboard",
			"createEmptyProject": "Create empty project",
			"delete": "Delete",
			"deleteTask": "Delete Task",
			"deleteUser": "Delete User",
			"discardChanges": "Discard changes",
			"heading": "Heading",
			"learnToAddMany": "Learn to create a {0} or to rename your audio file with {1}.",
			"lookForProjects": "Looking for Paratext projects on this computer...",
			"makeProject": "Make new project",
			"milestones": "Milestones",
			"next": "Next",
			"noProjectsFound": "We didn\u2019t find any Paratext projects on your computer.",
			"otherProjects": "Other Projects",
			"ourNamingConvention": "our naming convention",
			"pairWithParatext": "Pair with Paratext",
			"pairedWithParatextProject": "Paired with Paratext project",
			"people": "People",
			"preview": "Preview",
			"projectName": "Project Name",
			"projectSettings": "Project Settings",
			"reference": "Reference",
			"referenceFormat": "Reference format: LUK 1:1-4 or LUK 1.1,4",
			"reviewed": "Reviewed",
			"reviewer": "Reviewer",
			"roles": "Roles",
			"selectProject": "Select a Paratext Project",
			"skip": "Skip",
			"sortByRoles": "Sort by roles",
			"sortByType": "Sort by type",
			"start": "Start",
			"synced": "Synced",
			"taskDetails": "Task Details",
			"tasks": "Tasks",
			"transcribed": "Transcribed",
			"transcriber": "Transcriber",
			"userDetails": "User Details",
		}
	}),
    "transcriber": new LocalizedStrings({
		"en": {
			"accept": "Accept",
			"all": "All",
			"assigned": "Assigned",
			"available": "Available",
			"bible": "Bible",
			"congratulations": "Congratulations",
			"continue": "Continue",
			"haveaniceday": "Have a nice day",
			"inboxzero": "inbox zero",
			"logout": "Log Out",
			"other": "Other",
			"review": "Review",
			"reviewed": "Reviewed",
			"storybook": "Storybook",
			"submit": "Submit",
			"synced": "Synced",
			"test": "Test",
			"todo": "To Do",
			"transcribe": "Transcribe",
			"transcribed": "Transcribed",
			"unassign": "Unassign",
			"upload": "Upload",
			"youhavereached": "You've reached",
		}
    }),
    "userSettings": new LocalizedStrings({
		"en": {
			"browse": "Browse",
			"chooseAvatar": "Choose an image file",
			"editAvatar": "Edit Avatar",
			"english": "English",
			"fastForward": "Fast Forward",
			"fastForwardErrorMessage": "Please fill in the Fast Forward",
			"font": "Font",
			"fontErrorMessage": "Please fill in the Font",
			"imageFile": "Image File",
			"keyboardShortcuts": "Keyboard Shortcuts",
			"language": "Language",
			"large": "Large",
			"medium": "Medium",
			"name": "Name",
			"nameErrorMessage": "Please fill in the Name",
			"newImage": "New Image",
			"password": "Password",
			"playPause": "Play / Pause",
			"playPauseErrorMessage": "Please fill in the Play/Pause",
			"privilegeTier": "Privilege Tier",
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
			"zoom": "Zoom"
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
