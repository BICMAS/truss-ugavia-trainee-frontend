import {
  Badge,
  Course,
  CourseStatus,
  UserStats,
} from "@/types";
import type { LearnerDashboardViewModel } from "@/api/dashboard";
import type { BackendLearningPath } from "@/api/learningPaths";
import type { ClaimCertificateResponse } from "@/api/certificates";

const DEMO_COURSE_DEFS = [
  {
    id: "demo-course-1",
    title: "Supply Chain Fundamentals",
    description:
      "Learn the core principles of modern supply chain management, from sourcing to last-mile delivery.",
    category: "Mandatory" as const,
    progress: 45,
    thumbnailSeed: "supply-chain",
    dueDate: "2026-08-15",
  },
  {
    id: "demo-course-2",
    title: "Warehouse Safety & Compliance",
    description:
      "Essential safety protocols, hazard identification, and regulatory compliance for warehouse operations.",
    category: "Mandatory" as const,
    progress: 100,
    thumbnailSeed: "warehouse-safety",
    dueDate: "2026-06-30",
  },
  {
    id: "demo-course-3",
    title: "Inventory Management Best Practices",
    description:
      "Master stock control, cycle counting, and demand forecasting techniques used in distribution centers.",
    category: "Recommended" as const,
    progress: 0,
    thumbnailSeed: "inventory",
    dueDate: "2026-09-01",
  },
  {
    id: "demo-course-4",
    title: "Customer Service Excellence",
    description:
      "Build skills for professional client communication, complaint resolution, and service recovery.",
    category: "Recommended" as const,
    progress: 20,
    thumbnailSeed: "customer-service",
    dueDate: "2026-08-20",
  },
  {
    id: "demo-course-5",
    title: "Logistics & Route Planning",
    description:
      "Optimize delivery routes, understand freight costs, and improve on-time performance metrics.",
    category: "Optional" as const,
    progress: 0,
    thumbnailSeed: "logistics",
    dueDate: "2026-10-01",
  },
];

function deriveStatus(progress: number): CourseStatus {
  if (progress >= 100) return CourseStatus.Completed;
  if (progress > 0) return CourseStatus.InProgress;
  return CourseStatus.NotStarted;
}

function buildModules(courseId: string, progress: number) {
  const moduleProgress = [
    progress >= 33,
    progress >= 66,
    progress >= 100,
  ];

  return ["Introduction", "Core Concepts", "Assessment"].map(
    (title, index) => ({
      id: `${courseId}-module-${index + 1}`,
      name: title,
      lessons: [
        {
          id: `${courseId}-lesson-${index + 1}`,
          title: `${title} Lesson`,
          scormPackageId: `demo-scorm-${courseId}`,
          isCompleted: moduleProgress[index],
          estimatedDuration: 20,
        },
      ],
    }),
  );
}

function buildDemoCourse(def: (typeof DEMO_COURSE_DEFS)[number]): Course {
  const status = deriveStatus(def.progress);
  const completedModules = Math.min(
    3,
    Math.floor(def.progress / 34) + (def.progress >= 100 ? 1 : 0),
  );

  return {
    id: def.id,
    title: def.title,
    description: def.description,
    thumbnail: `https://picsum.photos/seed/${def.thumbnailSeed}/600/400`,
    category: def.category,
    status,
    progress: def.progress,
    totalModules: 3,
    completedModules,
    deadline: def.dueDate,
    isDownloaded: false,
    scormPackageId: `demo-scorm-${def.id}`,
    certificateUrl:
      status === CourseStatus.Completed
        ? `https://example.com/demo-certificates/${def.id}.pdf`
        : undefined,
    modules: buildModules(def.id, def.progress).map((module) => ({
      id: module.id,
      title: module.name,
      duration: "20 min",
      isCompleted: module.lessons.every((lesson) => lesson.isCompleted),
      lessons: module.lessons,
    })),
  };
}

const DEMO_COURSES = DEMO_COURSE_DEFS.map(buildDemoCourse);

const DEMO_BADGES: Badge[] = [
  {
    id: "badge-1",
    name: "First Steps",
    description: "Started your first course",
    icon: "star",
    earnedDate: "2026-05-10",
    isLocked: false,
  },
  {
    id: "badge-2",
    name: "Safety Champion",
    description: "Completed Warehouse Safety course",
    icon: "shield",
    earnedDate: "2026-05-18",
    isLocked: false,
  },
  {
    id: "badge-3",
    name: "Streak Master",
    description: "7-day learning streak",
    icon: "zap",
    isLocked: true,
  },
  {
    id: "badge-4",
    name: "Top Performer",
    description: "Score above 90% on 3 assessments",
    icon: "trophy",
    isLocked: true,
  },
];

const DEMO_STATS: UserStats = {
  streakDays: 5,
  totalLearningHours: 12.5,
  completedCourses: 1,
  averageScore: 88,
  weeklyActivity: [25, 40, 15, 55, 30, 10, 45],
  scoreTrend: 4,
  completedCoursesTrend: 1,
  bicmasCoins: 320,
  badges: DEMO_BADGES,
};

export function getDemoCourses(): Course[] {
  return DEMO_COURSES.map((course) => ({ ...course }));
}

export function getDemoDashboard(): LearnerDashboardViewModel {
  return {
    courses: getDemoCourses(),
    learningPath: null,
    stats: { ...DEMO_STATS, badges: DEMO_BADGES.map((b) => ({ ...b })) },
    currentCourse: {
      course: DEMO_COURSES.find((c) => c.id === "demo-course-1") ?? null,
      attempt: {
        id: "demo-attempt-1",
        courseId: "demo-course-1",
        completionPercentage: 45,
        status: "IN_PROGRESS",
      },
    },
  };
}

export function getDemoAssignedCoursesRaw() {
  return DEMO_COURSE_DEFS.map((def, index) => {
    const modules = buildModules(def.id, def.progress);
    const status =
      def.progress >= 100
        ? "COMPLETED"
        : def.progress > 0
          ? "IN_PROGRESS"
          : "NOT_STARTED";

    return {
      id: `demo-assignment-${index + 1}`,
      assignmentId: `demo-assignment-${index + 1}`,
      courseId: def.id,
      dueDate: def.dueDate,
      progress: def.progress,
      completionPercentage: def.progress,
      status,
      scormPackageId: `demo-scorm-${def.id}`,
      attempt:
        def.progress > 0
          ? {
              id: `demo-attempt-${def.id}`,
              courseId: def.id,
              scormPackageId: `demo-scorm-${def.id}`,
              completionPercentage: def.progress,
              status,
            }
          : null,
      course: {
        id: def.id,
        title: def.title,
        description: def.description,
        imageUrl: `https://picsum.photos/seed/${def.thumbnailSeed}/600/400`,
        scormPackageId: `demo-scorm-${def.id}`,
        modules,
      },
    };
  });
}

export function getDemoLearningPaths(): BackendLearningPath[] {
  return [
    {
      id: "demo-path-1",
      title: "Van Sales Representative Certification",
      description:
        "A structured path covering supply chain basics, safety, inventory, and customer service for field teams.",
      curriculumSequence: [
        "demo-course-1",
        "demo-course-2",
        "demo-course-3",
        "demo-course-4",
      ],
      status: "PUBLISHED",
    },
  ];
}

export function getDemoAnnouncements() {
  return [
    {
      id: "demo-announcement-1",
      text: "Welcome to Truss Ugavi! Explore your assigned courses and track your progress on the dashboard.",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      user: { fullName: "Training Admin" },
    },
    {
      id: "demo-announcement-2",
      text: "New module available: Logistics & Route Planning. Check the course library to get started.",
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      user: { fullName: "Learning Team" },
    },
    {
      id: "demo-announcement-3",
      text: "Reminder: Complete Warehouse Safety & Compliance before end of month to earn your certificate.",
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      user: { fullName: "Safety Officer" },
    },
  ];
}

export function getDemoCertificateClaim(
  courseId: string,
): ClaimCertificateResponse {
  const course = DEMO_COURSES.find((c) => c.id === courseId);
  if (!course || course.status !== CourseStatus.Completed) {
    throw new Error("Certificate is not available for this course yet.");
  }

  return {
    issued: true,
    certificate: {
      id: `demo-cert-${courseId}`,
      userId: "demo-user-001",
      courseId,
      templateId: "demo-template",
      issuedAt: new Date().toISOString(),
      pdfPath: course.certificateUrl,
      verificationHash: `demo-hash-${courseId}`,
      issuedBy: "Truss Ugavi",
    },
  };
}

export function getDemoFieldTaskResult(moduleTitle: string) {
  return {
    id: `demo-field-task-${Date.now()}`,
    moduleTitle,
    status: "SUBMITTED",
    message: "Demo submission recorded. Connect the backend to persist field tasks.",
  };
}
