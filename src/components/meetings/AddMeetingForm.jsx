import { useState, useCallback } from 'react';
import { Calendar, Plus, Loader2, CheckCircle2, AlertTriangle, FileText, CalendarPlus, Zap } from 'lucide-react';
import SlideOver from '../ui/SlideOver';
import { useAddMeeting } from '../../hooks/useMeetings';
import { useBoardMembers } from '../../hooks/useBoardMembers';
import { useCreateMeetingDocs, useCreateCalendarEvent } from '../../hooks/useGoogleIntegration';
import { supabase } from '../../lib/supabase';
import { meetingTypeOptions, ORG_NAME } from '../../lib/constants';

/**
 * Meeting type presets — auto-fill title, time, and location.
 * Selecting a type applies the preset immediately.
 */
const PRESETS = {
  full_board: {
    title: 'Full Board Meeting',
    startTime: '11:30',
    endTime: '13:00',
    location: `${ORG_NAME} – Community Room`,
    createDocs: true,
    sendInvite: false,
  },
  committee: {
    title: '', // filled by committee name
    startTime: '12:00',
    endTime: '13:00',
    location: 'Virtual (Zoom)',
    createDocs: true,
    sendInvite: false,
  },
  special: {
    title: '',
    startTime: '',
    endTime: '',
    location: '',
    createDocs: false,
    sendInvite: false,
  },
  social: {
    title: '',
    startTime: '',
    endTime: '',
    location: '',
    createDocs: false,
    sendInvite: false,
  },
};

const COMMITTEE_PRESETS = {
  Executive: { title: 'Executive Committee' },
  Finance: { title: 'Finance Committee' },
  Governance: { title: 'Governance Committee' },
  'Strategy & Tracking': { title: 'Strategy & Tracking Committee' },
  'Donor Relations': { title: 'Donor Relations Committee' },
  'Signature Fundraiser': { title: 'Signature Fundraiser Committee' },
  'Web Planning': { title: 'Web Planning Committee' },
};

/**
 * Progress step indicator shown during multi-step scheduling.
 */
function ProgressSteps({ steps }) {
  return (
    <div className="space-y-2 px-5 py-4">
      {steps.map((step, i) => (
        <div key={i} className="flex items-center gap-3">
          {step.status === 'done' && (
            <CheckCircle2 className="w-4 h-4 text-green shrink-0" />
          )}
          {step.status === 'active' && (
            <Loader2 className="w-4 h-4 text-teal animate-spin shrink-0" />
          )}
          {step.status === 'pending' && (
            <div className="w-4 h-4 rounded-full border-2 border-border shrink-0" />
          )}
          {step.status === 'error' && (
            <AlertTriangle className="w-4 h-4 text-orange shrink-0" />
          )}
          <span className={`text-sm ${
            step.status === 'done' ? 'text-dark' :
            step.status === 'active' ? 'text-teal font-medium' :
            step.status === 'error' ? 'text-orange' :
            'text-med-gray'
          }`}>
            {step.label}
            {step.status === 'error' && step.error && (
              <span className="block text-[10px] text-med-gray mt-0.5">{step.error}</span>
            )}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function AddMeetingForm({ onClose, onSuccess }) {
  const { addMeeting, isSubmitting } = useAddMeeting();
  const { members } = useBoardMembers();
  const { createDocs } = useCreateMeetingDocs();
  const { createEvent } = useCreateCalendarEvent();

  // Form state
  const [meetingType, setMeetingType] = useState('full_board');
  const [title, setTitle] = useState(PRESETS.full_board.title);
  const [meetingDate, setMeetingDate] = useState('');
  const [startTime, setStartTime] = useState(PRESETS.full_board.startTime);
  const [endTime, setEndTime] = useState(PRESETS.full_board.endTime);
  const [location, setLocation] = useState(PRESETS.full_board.location);
  const [description, setDescription] = useState('');
  const [committee, setCommittee] = useState('');
  const [wantDocs, setWantDocs] = useState(true);
  const [wantInvite, setWantInvite] = useState(false);

  // Scheduling progress
  const [isScheduling, setIsScheduling] = useState(false);
  const [steps, setSteps] = useState([]);
  const [error, setError] = useState(null);

  // Apply preset when meeting type changes
  function handleTypeChange(type) {
    const preset = PRESETS[type];
    setMeetingType(type);
    setTitle(preset.title);
    setStartTime(preset.startTime);
    setEndTime(preset.endTime);
    setLocation(preset.location);
    setWantDocs(preset.createDocs);
    setWantInvite(preset.sendInvite);
    setCommittee('');
  }

  // Apply committee preset
  function handleCommitteeChange(name) {
    setCommittee(name);
    const preset = COMMITTEE_PRESETS[name];
    if (preset) {
      setTitle(preset.title);
    }
  }

  // The main event — multi-step scheduling
  const handleSchedule = useCallback(async (e) => {
    e.preventDefault();
    setIsScheduling(true);
    setError(null);

    const meetingTitle = title.trim();
    const meetingCommittee = meetingType === 'committee' ? committee : null;

    // Build step list based on what's enabled
    const stepList = [
      { id: 'meeting', label: 'Creating meeting', status: 'pending' },
    ];
    if (wantDocs) {
      stepList.push({ id: 'docs', label: 'Creating Google Drive documents', status: 'pending' });
    }
    if (wantInvite) {
      stepList.push({ id: 'invite', label: 'Sending calendar invites', status: 'pending' });
    }

    function updateStep(id, update) {
      stepList.forEach(s => { if (s.id === id) Object.assign(s, update); });
      setSteps([...stepList]);
    }

    // Step 1: Create the meeting in the database
    updateStep('meeting', { status: 'active' });

    const meeting = await addMeeting({
      title: meetingTitle,
      meetingType,
      meetingDate,
      startTime: startTime || null,
      endTime: endTime || null,
      location,
      description,
      committee: meetingCommittee,
      createAgenda: !wantDocs, // Only create placeholders if NOT creating real Google Docs
    });

    if (!meeting) {
      updateStep('meeting', { status: 'error', error: 'Failed to create meeting.' });
      setIsScheduling(false);
      return;
    }

    updateStep('meeting', { status: 'done', label: 'Meeting created' });

    // Step 2: Create Google Drive documents (if enabled)
    if (wantDocs) {
      updateStep('docs', { status: 'active' });

      const docs = await createDocs({
        meetingTitle,
        meetingDate,
        meetingType,
        committee: meetingCommittee,
      });

      if (docs) {
        // Link the real Google Docs to the meeting via the documents table
        // and store the Drive folder URLs on the meeting record
        try {
          if (supabase) {
            // Store folder URLs on the meeting so MeetingDetail can link to them
            await supabase
              .from('meetings')
              .update({
                drive_folder_url: docs.folderUrl,
                drive_parent_folder_url: docs.parentFolderUrl,
                drive_root_folder_url: docs.rootFolderUrl,
              })
              .eq('id', meeting.id);

            // Create document records with the actual Google Doc URLs
            const { data: agendaDoc } = await supabase
              .from('documents')
              .insert({
                title: `Agenda — ${meetingTitle} (${meetingDate})`,
                description: 'Auto-created from template.',
                category: 'agenda',
                storage_type: 'external',
                external_url: docs.agendaUrl,
              })
              .select()
              .single();

            const { data: minutesDoc } = await supabase
              .from('documents')
              .insert({
                title: `Minutes — ${meetingTitle} (${meetingDate})`,
                description: 'Auto-created from template.',
                category: 'minutes',
                storage_type: 'external',
                external_url: docs.minutesUrl,
              })
              .select()
              .single();

            // Link to the meeting
            if (agendaDoc && minutesDoc) {
              await supabase
                .from('meeting_documents')
                .insert([
                  { meeting_id: meeting.id, document_id: agendaDoc.id, sort_order: 0 },
                  { meeting_id: meeting.id, document_id: minutesDoc.id, sort_order: 1 },
                ]);
            }
          }
        } catch (linkErr) {
          if (import.meta.env.DEV) console.warn('Doc linking failed:', linkErr.message);
        }

        updateStep('docs', { status: 'done', label: 'Documents created in Google Drive' });
      } else {
        updateStep('docs', {
          status: 'error',
          label: 'Google Drive documents',
          error: 'Could not create docs — you can add them manually later.',
        });
      }
    }

    // Step 3: Create calendar event with invites (if enabled)
    if (wantInvite && startTime && endTime) {
      updateStep('invite', { status: 'active' });

      const attendeeEmails = members
        .filter(m => m.status === 'active' && m.email)
        .map(m => m.email);

      const event = await createEvent({
        title: meetingTitle,
        date: meetingDate,
        startTime,
        endTime,
        location,
        description,
        attendeeEmails,
      });

      if (event) {
        updateStep('invite', {
          status: 'done',
          label: `Calendar invites sent to ${attendeeEmails.length} members`,
        });
      } else {
        updateStep('invite', {
          status: 'error',
          label: 'Calendar invites',
          error: 'Could not send invites — members can add it manually.',
        });
      }
    }

    // All done — wait a moment so the user can see the completed steps
    setTimeout(() => {
      onSuccess?.();
      onClose();
    }, 1500);
  }, [title, meetingType, meetingDate, startTime, endTime, location, description,
      committee, wantDocs, wantInvite, members, addMeeting, createDocs, createEvent,
      onSuccess, onClose]);

  const isValid = title.trim() && meetingDate && (meetingType !== 'committee' || committee.trim());

  // Show progress view when scheduling
  if (isScheduling) {
    return (
      <SlideOver onClose={() => {}} icon={Zap} iconColor="text-teal" title="Scheduling...">
        <div className="flex-1 flex flex-col justify-center">
          <ProgressSteps steps={steps} />
        </div>
      </SlideOver>
    );
  }

  return (
    <SlideOver onClose={onClose} icon={Calendar} title="Schedule Meeting">
      <form onSubmit={handleSchedule} className="flex-1 overflow-y-auto px-5 py-4 space-y-4">

        {/* Meeting Type — big buttons */}
        <div>
          <label className="block text-xs font-medium text-dark mb-1.5">Meeting Type</label>
          <div className="grid grid-cols-2 gap-2">
            {meetingTypeOptions.map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => handleTypeChange(value)}
                className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors
                  ${meetingType === value
                    ? 'border-teal bg-teal-light/30 text-teal'
                    : 'border-border text-med-gray hover:bg-light-gray'
                  }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Committee quick-pick (conditional) */}
        {meetingType === 'committee' && (
          <div>
            <label className="block text-xs font-medium text-dark mb-1.5">Committee</label>
            <div className="flex flex-wrap gap-1.5">
              {Object.keys(COMMITTEE_PRESETS).map(name => (
                <button
                  key={name}
                  type="button"
                  onClick={() => handleCommitteeChange(name)}
                  className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors
                    ${committee === name
                      ? 'border-teal bg-teal-light/30 text-teal'
                      : 'border-border text-med-gray hover:bg-light-gray'
                    }`}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Title (pre-filled by preset, editable) */}
        <div>
          <label className="block text-xs font-medium text-dark mb-1">
            Title <span className="text-orange">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Full Board Meeting"
            className="w-full px-3 py-2.5 rounded-lg border border-border bg-white
                       text-sm text-dark placeholder:text-med-gray
                       focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-xs font-medium text-dark mb-1">
            Date <span className="text-orange">*</span>
          </label>
          <input
            type="date"
            value={meetingDate}
            onChange={(e) => setMeetingDate(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg border border-border bg-white
                       text-sm text-dark
                       focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
          />
        </div>

        {/* Time range (pre-filled) */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-dark mb-1">Start Time</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-border bg-white
                         text-sm text-dark
                         focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-dark mb-1">End Time</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-border bg-white
                         text-sm text-dark
                         focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
            />
          </div>
        </div>

        {/* Location (pre-filled) */}
        <div>
          <label className="block text-xs font-medium text-dark mb-1">Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g., Community Room"
            className="w-full px-3 py-2.5 rounded-lg border border-border bg-white
                       text-sm text-dark placeholder:text-med-gray
                       focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-medium text-dark mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional notes about this meeting..."
            rows={2}
            className="w-full px-3 py-2.5 rounded-lg border border-border bg-white
                       text-sm text-dark placeholder:text-med-gray resize-none
                       focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
          />
        </div>

        {/* Automation toggles */}
        <div className="pt-1 border-t border-border/50 space-y-3">
          <p className="text-[10px] font-semibold text-med-gray uppercase tracking-wider">Automations</p>

          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={wantDocs}
              onChange={(e) => setWantDocs(e.target.checked)}
              className="mt-0.5 w-3.5 h-3.5 rounded border-border text-teal
                         focus:ring-teal focus:ring-offset-0 accent-teal"
            />
            <div>
              <span className="flex items-center gap-1.5 text-xs font-medium text-dark">
                <FileText className="w-3 h-3 text-teal" />
                Create agenda &amp; minutes in Google Drive
              </span>
              <p className="text-[10px] text-med-gray mt-0.5">
                Copies your templates into the board folder, linked to this meeting.
              </p>
            </div>
          </label>

          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={wantInvite}
              onChange={(e) => setWantInvite(e.target.checked)}
              className="mt-0.5 w-3.5 h-3.5 rounded border-border text-teal
                         focus:ring-teal focus:ring-offset-0 accent-teal"
            />
            <div>
              <span className="flex items-center gap-1.5 text-xs font-medium text-dark">
                <CalendarPlus className="w-3 h-3 text-teal" />
                Send calendar invites to all board members
              </span>
              <p className="text-[10px] text-med-gray mt-0.5">
                Creates a Google Calendar event and emails invites to {members.filter(m => m.status === 'active').length || 'all'} active members.
              </p>
            </div>
          </label>
        </div>

        {/* Error */}
        {error && (
          <p className="text-xs text-orange bg-orange/10 px-3 py-2 rounded-lg">{error}</p>
        )}
      </form>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-border flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm text-med-gray hover:text-dark rounded-lg
                     hover:bg-light-gray transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSchedule}
          disabled={!isValid || isSubmitting}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white
                     bg-teal rounded-lg hover:bg-teal-dark transition-colors
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Zap className="w-4 h-4" />
          Schedule{wantDocs || wantInvite ? ' Everything' : ' Meeting'}
        </button>
      </div>
    </SlideOver>
  );
}
