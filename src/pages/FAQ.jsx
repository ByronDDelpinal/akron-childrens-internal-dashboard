import { useState } from 'react';
import { HelpCircle, ChevronDown, Lightbulb, Compass } from 'lucide-react';
import Card from '../components/ui/Card';
import IconBox from '../components/ui/IconBox';

/* ── FAQ Content ────────────────────────────────────────────── */

const sections = [
  {
    id: 'getting-started',
    icon: Compass,
    accent: 'teal',
    title: 'Getting Started',
    description: 'Understanding the portal and why we built it',
    items: [
      {
        q: 'What is the Board Portal?',
        a: 'The Board Portal is a central hub for everything related to the Akron Children\'s Museum board of directors. It replaces scattered emails, Google Drive links, and text messages with a single place to find meeting schedules, documents, proposals, and announcements. Think of it as the board\'s homepage.',
      },
      {
        q: 'Why are we moving to a portal instead of using email and Google Drive?',
        a: 'As the museum grows, so does the volume of board materials. Important documents were getting buried in email threads, new members had no easy way to find past meeting minutes, and there was no single place to see what\'s coming up. The portal solves this by giving everyone the same view of the same information — no more "can you resend that attachment?" messages.',
      },
      {
        q: 'Do I need to install anything?',
        a: 'No. The portal is a website that works in any modern browser (Chrome, Safari, Edge, Firefox) on your computer, tablet, or phone. Just bookmark the link and you\'re set.',
      },
      {
        q: 'How do I log in?',
        a: 'You\'ll use the shared board password that was provided to you. If you don\'t have it, ask any fellow board member or the board chair. There are no individual accounts — everyone uses the same password to keep things simple.',
      },
      {
        q: 'Does this replace Google Drive?',
        a: 'Not exactly. Google Drive is still where the actual documents live (agendas, minutes, board packets, etc.). The portal acts as an organized index that links to those documents so you can find them quickly without digging through folders. Over time, we\'ll make the connection between the portal and Drive even tighter.',
      },
      {
        q: 'What if I\'m not very tech-savvy?',
        a: 'That\'s completely okay — the portal was designed with simplicity in mind. If you can browse a website, you can use the portal. Everything is one or two clicks away. And if you ever get stuck, reach out to the Web Planning committee for help.',
      },
    ],
  },
  {
    id: 'meetings',
    icon: HelpCircle,
    accent: 'teal',
    title: 'Meetings & Calendar',
    description: 'Scheduling, viewing, and preparing for meetings',
    items: [
      {
        q: 'How do I see upcoming meetings?',
        a: 'The Dashboard shows the next few upcoming meetings right on the main page. For a full list (including past meetings), click "Meetings" in the left sidebar.',
      },
      {
        q: 'How do I add a meeting to my personal calendar?',
        a: 'Open any upcoming meeting by clicking on it, then click the "Add to Google Calendar" button. This opens Google Calendar with all the meeting details pre-filled — just click Save.',
      },
      {
        q: 'How do I schedule a new meeting?',
        a: 'Click the "+ Add" button on the Meetings page or the Upcoming Meetings card on the Dashboard. Fill in the title, date, time, and location. If you leave the "Create placeholder agenda & minutes" checkbox on, the portal will automatically create linked placeholder documents for you.',
      },
      {
        q: 'What are placeholder documents?',
        a: 'When you schedule a meeting, the portal can auto-create "Agenda" and "Minutes" placeholder documents linked to that meeting. These are empty placeholders — they\'re there so you remember to add the real agenda and minutes later. You can replace them with links to the actual Google Docs when they\'re ready.',
      },
      {
        q: 'Can I edit or cancel a meeting after creating it?',
        a: 'Yes. Open the meeting and click the pencil icon next to the title. You can change the date, time, location, description, and title. You can also mark a meeting as cancelled — it\'ll stay visible but with a "Cancelled" badge, and the board will be notified automatically.',
      },
    ],
  },
  {
    id: 'documents',
    icon: HelpCircle,
    accent: 'teal',
    title: 'Documents',
    description: 'Finding, adding, and organizing board materials',
    items: [
      {
        q: 'Where do I find meeting agendas and minutes?',
        a: 'There are two ways: click on a specific meeting to see all documents linked to it, or go to the Documents page and use the search bar or category filter to find what you need.',
      },
      {
        q: 'How do I add a document?',
        a: 'Click "+ Add" on the Documents page or from within a meeting\'s detail view. You\'ll paste a link to the document (usually a Google Drive URL), give it a title, choose a category, and optionally link it to one or more meetings.',
      },
      {
        q: 'What categories should I use?',
        a: 'Use whatever best describes the document: Board Packet for the full pre-meeting bundle, Agenda for meeting agendas, Minutes for approved minutes, Financial Report for treasurer reports, Governance for bylaws and policies, and so on. If nothing fits, "Other" works fine.',
      },
      {
        q: 'Can I upload files directly?',
        a: 'Currently, the portal links to external documents (Google Drive, Dropbox, etc.) rather than storing files directly. This keeps things simple and means documents are always in one place. Just paste the sharing link when adding a document.',
      },
      {
        q: 'What happens when I delete a document?',
        a: 'Deleting a document removes it from the portal and unlinks it from any meetings. The actual file in Google Drive is not affected — only the portal reference is removed. A notification is automatically posted so the board knows it was removed.',
      },
    ],
  },
  {
    id: 'proposals',
    icon: HelpCircle,
    accent: 'purple',
    title: 'Proposals',
    description: 'Submitting and tracking board action proposals',
    items: [
      {
        q: 'What is a board action proposal?',
        a: 'A proposal is a formal request for the board to take action on something — approving a budget, adopting a policy, authorizing a purchase, etc. The portal gives proposals a structured workflow so nothing falls through the cracks.',
      },
      {
        q: 'How do I submit a proposal?',
        a: 'Go to the Proposals page and click "Submit Proposal." Start by making a copy of the Proposal Template linked on that page, fill it out in Google Docs, then submit through the portal with a link to your completed document. The board will be notified automatically.',
      },
      {
        q: 'Who can submit proposals?',
        a: 'Any board member, committee, or staff member can submit a proposal. You don\'t need special permissions.',
      },
      {
        q: 'What do the proposal statuses mean?',
        a: 'Submitted means it\'s been filed and is awaiting board review. Approved means the board voted to approve it. Denied means the board voted against it. Status changes trigger automatic notifications.',
      },
      {
        q: 'Can a proposal status be changed after it\'s set?',
        a: 'Yes. If a status was set by mistake, it can be reverted. Click the status dropdown on any proposal card to change it. You\'ll be asked to confirm before the change is made.',
      },
    ],
  },
  {
    id: 'announcements',
    icon: HelpCircle,
    accent: 'teal',
    title: 'Announcements & Updates',
    description: 'Staying informed about board activity',
    items: [
      {
        q: 'What\'s the difference between Announcements and Updates?',
        a: 'Announcements are manually posted messages — things like "Annual Report draft is ready for review" or "Reminder: board retreat next Saturday." Updates are auto-generated by the portal when actions happen, like when a new document is added or a meeting is scheduled. Both appear on the Dashboard.',
      },
      {
        q: 'How do I post an announcement?',
        a: 'Click the "+ Add" button on the Announcements card on the Dashboard. Give it a title, a brief summary, and optionally mark it as Important or set an expiration date.',
      },
      {
        q: 'What does marking something as "Important" do?',
        a: 'Important announcements get a visual highlight (orange warning icon and "Important" badge) so they stand out. Use this sparingly — for truly urgent or time-sensitive information.',
      },
    ],
  },
  {
    id: 'transition',
    icon: Lightbulb,
    accent: 'orange',
    title: 'About This Transition',
    description: 'What\'s changing, what\'s not, and how to adapt',
    items: [
      {
        q: 'Is this mandatory? Do I have to use the portal?',
        a: 'We\'re encouraging everyone to use the portal as the primary way to find board materials and stay up to date. Important communications will still go out via email when needed, but the portal is where everything lives. The more everyone uses it, the more useful it becomes for everyone.',
      },
      {
        q: 'Will I still get emails about meetings and documents?',
        a: 'For now, yes — email communication isn\'t going away. The portal is an additional tool, not a replacement for direct communication. Over time, as the board gets comfortable, we may rely more on the portal for routine updates and reserve email for urgent items.',
      },
      {
        q: 'What if something is wrong or missing?',
        a: 'The portal is a living tool and we\'re actively improving it. If you notice missing information, broken links, or have suggestions, reach out to the Web Planning committee. Your feedback is genuinely valuable — it helps us make this work for everyone.',
      },
      {
        q: 'Who built this and who maintains it?',
        a: 'The portal was developed by the Web Planning special project committee as part of the museum\'s effort to improve board operations. The same committee handles ongoing maintenance and improvements.',
      },
      {
        q: 'I liked how things worked before. Why change?',
        a: 'We understand that change can be uncomfortable, and the old way worked well enough for a long time. But as the museum grows — more board members, more committees, more documents — having a central place to organize everything saves time and reduces confusion. The goal isn\'t to make things harder; it\'s to make sure nothing important gets lost as the organization scales.',
      },
      {
        q: 'What\'s coming next?',
        a: 'We\'re planning tighter Google Drive integration (auto-created meeting folders), a financial reports page sourced from official 990 filings, and eventually role-based access so committee chairs can manage their own content. We\'ll announce new features through the portal itself as they roll out.',
      },
    ],
  },
];

/* ── Accordion Item ─────────────────────────────────────────── */

function AccordionItem({ question, answer, isOpen, onToggle }) {
  return (
    <div className="border-b border-border/50 last:border-b-0">
      <button
        onClick={onToggle}
        className="flex items-start gap-3 w-full text-left py-3.5 px-1 group"
      >
        <ChevronDown
          className={`w-4 h-4 text-med-gray shrink-0 mt-0.5 transition-transform duration-200
            ${isOpen ? 'rotate-180' : ''}`}
        />
        <span className="text-sm font-medium text-dark group-hover:text-teal transition-colors">
          {question}
        </span>
      </button>
      <div
        className="overflow-hidden transition-all duration-250"
        style={{
          maxHeight: isOpen ? '500px' : '0',
          opacity: isOpen ? 1 : 0,
        }}
      >
        <p className="text-sm text-med-gray leading-relaxed pl-7 pr-2 pb-4">
          {answer}
        </p>
      </div>
    </div>
  );
}

/* ── FAQ Section ────────────────────────────────────────────── */

function FAQSection({ section }) {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <Card>
      <div className="flex items-start gap-3 mb-4">
        <IconBox icon={section.icon} accent={section.accent} size="sm" />
        <div>
          <h3 className="text-sm font-semibold text-dark">{section.title}</h3>
          <p className="text-xs text-med-gray mt-0.5">{section.description}</p>
        </div>
      </div>
      <div>
        {section.items.map((item, i) => (
          <AccordionItem
            key={i}
            question={item.q}
            answer={item.a}
            isOpen={openIndex === i}
            onToggle={() => setOpenIndex(openIndex === i ? null : i)}
          />
        ))}
      </div>
    </Card>
  );
}

/* ── Page ───────────────────────────────────────────────────── */

export default function FAQ() {
  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-5">
      {/* Page header */}
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-dark">Frequently Asked Questions</h2>
        <p className="text-sm text-med-gray mt-0.5">
          Everything you need to know about using the Board Portal
        </p>
      </div>

      {sections.map(section => (
        <FAQSection key={section.id} section={section} />
      ))}
    </div>
  );
}
