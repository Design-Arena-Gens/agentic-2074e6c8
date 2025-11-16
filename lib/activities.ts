export type ActivityCategory = "Academics" | "Sports" | "Arts" | "Clubs" | "Community" | "Administration";

export type ActivityStatus = "Scheduled" | "In Progress" | "Completed" | "Cancelled";

export interface Activity {
  id: string;
  title: string;
  className: string;
  type: ActivityCategory;
  description: string;
  location: string;
  start: string;
  end: string;
  status: ActivityStatus;
  staffLead: string;
  participants: number;
  focusArea: string;
}

export const activities: Activity[] = [
  {
    id: "A-101",
    title: "STEM Robotics Workshop",
    className: "Grade 10",
    type: "Academics",
    description:
      "Hands-on robotics workshop covering basic programming, sensor integration, and problem-solving challenges.",
    location: "Innovation Lab",
    start: "2024-09-09T10:30:00Z",
    end: "2024-09-09T12:00:00Z",
    status: "Scheduled",
    staffLead: "Ms. Patel",
    participants: 28,
    focusArea: "STEM Excellence",
  },
  {
    id: "A-102",
    title: "Varsity Basketball Practice",
    className: "Grade 11",
    type: "Sports",
    description:
      "Pre-season conditioning drills, skills training, and team strategy session led by athletic department.",
    location: "Main Gymnasium",
    start: "2024-09-09T15:00:00Z",
    end: "2024-09-09T17:00:00Z",
    status: "In Progress",
    staffLead: "Coach Rivera",
    participants: 16,
    focusArea: "Athletics",
  },
  {
    id: "A-103",
    title: "Fall Choir Rehearsal",
    className: "Grade 9",
    type: "Arts",
    description:
      "Sectional rehearsal focusing on vocal blending, dynamics, and performance preparation for fall concert.",
    location: "Performing Arts Center",
    start: "2024-09-10T08:00:00Z",
    end: "2024-09-10T09:15:00Z",
    status: "Scheduled",
    staffLead: "Mr. Chen",
    participants: 35,
    focusArea: "Creative Arts",
  },
  {
    id: "A-104",
    title: "Student Council Planning",
    className: "Grade 12",
    type: "Clubs",
    description:
      "Strategic planning meeting for homecoming week events, budgeting, and volunteer coordination.",
    location: "Student Leadership Hub",
    start: "2024-09-08T13:00:00Z",
    end: "2024-09-08T14:30:00Z",
    status: "Completed",
    staffLead: "Ms. Thompson",
    participants: 14,
    focusArea: "Leadership",
  },
  {
    id: "A-105",
    title: "Community Service Outreach",
    className: "Grade 11",
    type: "Community",
    description:
      "Partnership with local food bank to assemble care packages and deliver community resources.",
    location: "City Outreach Center",
    start: "2024-09-11T09:00:00Z",
    end: "2024-09-11T13:00:00Z",
    status: "Scheduled",
    staffLead: "Mr. Alvarez",
    participants: 24,
    focusArea: "Service Learning",
  },
  {
    id: "A-106",
    title: "Faculty Professional Development",
    className: "Faculty",
    type: "Administration",
    description:
      "Quarterly professional development session focused on differentiated instruction and assessment design.",
    location: "Learning Commons",
    start: "2024-09-07T08:30:00Z",
    end: "2024-09-07T11:30:00Z",
    status: "Completed",
    staffLead: "Principal Morgan",
    participants: 52,
    focusArea: "Instructional Excellence",
  },
  {
    id: "A-107",
    title: "Debate Team Scrimmage",
    className: "Grade 10",
    type: "Clubs",
    description:
      "Mock tournament rounds with peer feedback and judge panel to prepare for regional championships.",
    location: "Room 212",
    start: "2024-09-12T15:30:00Z",
    end: "2024-09-12T17:30:00Z",
    status: "Scheduled",
    staffLead: "Ms. Lawson",
    participants: 18,
    focusArea: "Speech & Debate",
  },
  {
    id: "A-108",
    title: "Track & Field Conditioning",
    className: "Grade 9",
    type: "Sports",
    description:
      "Speed and agility circuit focused on sprint mechanics, dynamic flexibility, and injury prevention.",
    location: "Outdoor Track",
    start: "2024-09-06T06:45:00Z",
    end: "2024-09-06T07:45:00Z",
    status: "Completed",
    staffLead: "Coach Fields",
    participants: 22,
    focusArea: "Athletics",
  },
  {
    id: "A-109",
    title: "Drama Club Set Design",
    className: "Grade 12",
    type: "Arts",
    description:
      "Collaborative workshop to finalize stage layout, build props, and coordinate tech cues for fall play.",
    location: "Black Box Theater",
    start: "2024-09-13T14:00:00Z",
    end: "2024-09-13T17:00:00Z",
    status: "Scheduled",
    staffLead: "Mr. Owens",
    participants: 26,
    focusArea: "Creative Arts",
  },
  {
    id: "A-110",
    title: "Grade-Level Advisory Check-In",
    className: "Grade 8",
    type: "Administration",
    description:
      "Monthly advisory check-in covering academic progress review, SEL reflection, and parent communication planning.",
    location: "Advisory Pods",
    start: "2024-09-10T11:30:00Z",
    end: "2024-09-10T12:15:00Z",
    status: "Scheduled",
    staffLead: "Counselor Brooks",
    participants: 120,
    focusArea: "Student Support",
  },
  {
    id: "A-111",
    title: "Environmental Club Garden Cleanup",
    className: "Grade 7",
    type: "Community",
    description:
      "Seasonal maintenance of the school garden beds, native species planting, and composting workshop.",
    location: "School Courtyard",
    start: "2024-09-14T09:30:00Z",
    end: "2024-09-14T11:00:00Z",
    status: "Scheduled",
    staffLead: "Ms. Greene",
    participants: 32,
    focusArea: "Sustainability",
  },
  {
    id: "A-112",
    title: "AP Exam Strategy Seminar",
    className: "Grade 12",
    type: "Academics",
    description:
      "Intensive review session covering exam pacing, free-response analysis, and collaborative study planning.",
    location: "Lecture Hall B",
    start: "2024-09-15T10:00:00Z",
    end: "2024-09-15T12:30:00Z",
    status: "Scheduled",
    staffLead: "Dr. Nguyen",
    participants: 48,
    focusArea: "College Readiness",
  },
];
