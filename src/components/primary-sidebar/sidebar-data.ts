import {
    BarChart4,
    BellRing,
    BookmarkMinus,
    Box,
    CircleAlert,
    CircleHelp,
    ClipboardCheck,
    FileCog,
    FilePlus2,
    FileSignature,
    FileText,
    FileVideo,
    FolderClosed,
    FolderCog,
    HeartPulse,
    InfoIcon,
    LayoutGrid,
    LucideIcon,
    MapPinned,
    MessageCircleMore,
    MessageSquareMore,
    Network,
    Package,
    Pill,
    PillBottle,
    Settings,
    Shield,
    UserRound,
    Youtube
} from "lucide-react";
import Building from "@/building.svg";
import OnBoarding from "@/onboarding.svg";

export interface Group {
    name: string;
    subMenuItems: subMenuItem[];
}
export interface subMenuItem {
    title: string;
    url: string;
    canAccess: string[];
    icon: LucideIcon;
    items: subMenuItem[];
}
const sideBarGroups: Group[] = [
    {
        "name": "CMS",
        "subMenuItems": [
            {
                "title": "Article",
                "url": "/articles",
                "canAccess": ["owner", "content-admin", "super-admin", "admin"],
                "icon": FileText,
                "items": []
            },
            {
                "title": "Videos",
                "url": "#Videos",
                "canAccess": ["owner", "content-admin", "super-admin", "admin"],
                "icon": Youtube,
                "items": []
            },
            {
                "title": "Animations",
                "url": "#Animations",
                "canAccess": ["owner", "content-admin", "super-admin", "admin"],
                "icon": FileVideo,
                "items": []
            },
            {
                "title": "Questions",
                "url": "#Questions",
                "canAccess": ["owner", "content-admin", "super-admin", "admin"],
                "icon": CircleHelp,
                "items": []
            },
            {
                "title": "Tips",
                "url": "#Tips",
                "canAccess": ["owner", "content-admin", "super-admin", "admin"],
                "icon": InfoIcon,
                "items": []
            },
            {
                "title": "Tips Categories",
                "url": "#Tips Categories",
                "canAccess": ["owner", "content-admin", "super-admin", "admin"],
                "icon": LayoutGrid,
                "items": []
            },
            {
                "title": "Sections",
                "url": "#Sections",
                "canAccess": ["owner", "content-admin", "super-admin", "admin"],
                "icon": FolderClosed,
                "items": []
            },
            {
                "title": "Subsections",
                "url": "#Subsections",
                "canAccess": ["owner", "content-admin", "super-admin", "admin"],
                "icon": BookmarkMinus,
                "items": []
            },
            {
                "title": "Collections",
                "url": "#Collections",
                "canAccess": ["owner", "content-admin", "super-admin", "admin"],
                "icon": Box,
                "items": []
            },
            {
                "title": "Surveys",
                "url": "#Surveys",
                "canAccess": ["owner", "content-admin", "super-admin", "admin"],
                "icon": FileSignature,
                "items": [
                    {
                        "title": "Survey S1",
                        "url": "#Survey S1",
                        "canAccess": ["owner", "content-admin", "super-admin", "admin"],
                        "icon": Box,
                        "items": [
                            {
                                "title": "Survey S1",
                                "url": "#Survey S1",
                                "canAccess": ["owner", "content-admin", "super-admin", "admin"],
                                "icon": Box,
                                "items": []
                            }
                        ]
                    }
                ]
            },
            {
                "title": "My ICS",
                "url": "#My ICS",
                "canAccess": ["owner", "content-admin", "super-admin", "admin"],
                "icon": Building,
                "items": []
            },
            {
                "title": "Onboarding Flow",
                "url": "#Onboarding Flow",
                "canAccess": ["owner", "content-admin", "super-admin", "admin"],
                "icon": OnBoarding,
                "items": []
            },
            {
                "title": "Journey",
                "url": "/journey",
                "canAccess": ["owner", "content-admin", "super-admin", "admin"],
                "icon": MapPinned,
                "items": []
            },
            {
                "title": "Health Tracker ",
                "url": "#Health Tracker ",
                "canAccess": ["owner", "content-admin", "super-admin", "admin"],
                "icon": HeartPulse,
                "items": []
            }
        ]
    },
    {
        "name": "Analytics",
        "subMenuItems": [
            {
                "title": "Analytics",
                "url": "#Analytics",
                "canAccess": ["owner", "super-admin", "admin"],
                "icon": BarChart4,
                "items": [
                    {
                        "title": "Analytics 1",
                        "url": "#Analytics 1",
                        "canAccess": ["owner", "super-admin", "admin"],
                        "icon": Box,
                        "items": [
                            {
                                "title": "Survey S1",
                                "url": "#Survey S1",
                                "canAccess": ["owner", "content-admin", "super-admin", "admin"],
                                "icon": Box,
                                "items": []
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        "name": "Logs",
        "subMenuItems": [
            {
                "title": "NHS Activity Logs",
                "url": "#NHS Activity Logs",
                "canAccess": ["owner", "super-admin", "admin"],
                "icon": ClipboardCheck,
                "items": [
                    {
                        "title": "Activity Logs",
                        "url": "#Activity Logs",
                        "canAccess": ["owner", "super-admin", "admin"],
                        "icon": Box,
                        "items": []
                    }
                ]
            },
            {
                "title": "CRON Logs",
                "url": "#CRON Logs",
                "canAccess": ["owner", "super-admin", "admin"],
                "icon": FilePlus2,
                "items": [
                    {
                        "title": "CRON Logs",
                        "url": "#CRON Logs",
                        "canAccess": ["owner", "super-admin", "admin"],
                        "icon": Box,
                        "items": []
                    }
                ]
            }
        ]
    },
    {
        "name": "App Config",
        "subMenuItems": [
            {
                "title": "Version Update ",
                "url": "#Version Update ",
                "canAccess": ["owner", "super-user", "super-admin", "admin"],
                "icon": Package,
                "items": [
                    {
                        "title": "Version Update ",
                        "url": "#Version Update",
                        "canAccess": ["owner", "super-user", "super-admin", "admin"],
                        "icon": Box,
                        "items": []
                    }
                ]
            },
            {
                "title": "Maintenance Mode",
                "url": "#Maintenance Mode",
                "canAccess": ["owner", "super-user", "super-admin", "admin"],
                "icon": FolderCog,
                "items": [
                    {
                        "title": "Maintenance Mode",
                        "url": "#Maintenance Mode",
                        "canAccess": ["owner", "super-user", "super-admin", "admin"],
                        "icon": Box,
                        "items": []
                    }
                ]
            },
            {
                "title": "Settings ",
                "url": "#Settings ",
                "canAccess": ["owner", "super-user", "super-admin", "admin"],
                "icon": Settings,
                "items": [
                    {
                        "title": "Settings ",
                        "url": "#Settings",
                        "canAccess": ["owner", "super-user", "super-admin", "admin"],
                        "icon": Box,
                        "items": []
                    }
                ]
            },
            {
                "title": "Changelog",
                "url": "#Changelog",
                "canAccess": ["owner", "super-user", "super-admin", "admin"],
                "icon": FileCog,
                "items": [
                    {
                        "title": "Changelog",
                        "url": "#Changelog",
                        "canAccess": ["owner", "super-user", "super-admin", "admin"],
                        "icon": Box,
                        "items": []
                    }
                ]
            },
            {
                "title": "Schema",
                "url": "#Schema",
                "canAccess": ["owner", "super-user", "super-admin", "admin"],
                "icon": Network,
                "items": [
                    {
                        "title": "Schema",
                        "url": "#Schema",
                        "canAccess": ["owner", "super-user", "super-admin", "admin"],
                        "icon": Box,
                        "items": []
                    }
                ]
            },
            {
                "title": "Push Notifications ",
                "url": "#Push Notifications ",
                "canAccess": ["owner", "super-user", "super-admin", "admin"],
                "icon": BellRing,
                "items": [
                    {
                        "title": "Push Notifications ",
                        "url": "#CRON Logs",
                        "canAccess": ["owner", "super-user", "super-admin", "admin"],
                        "icon": Box,
                        "items": []
                    }
                ]
            },
            {
                "title": "About App ",
                "url": "#About App ",
                "canAccess": ["owner", "super-user", "super-admin", "admin"],
                "icon": CircleAlert,
                "items": [
                    {
                        "title": "About App ",
                        "url": "#About App",
                        "canAccess": ["owner", "super-user", "super-admin", "admin"],
                        "icon": Box,
                        "items": []
                    }
                ]
            },
            {
                "title": "Support ",
                "url": "#Support ",
                "canAccess": ["owner", "super-user", "super-admin", "admin"],
                "icon": MessageSquareMore,
                "items": [
                    {
                        "title": "Support ",
                        "url": "#CRON Logs",
                        "canAccess": ["owner", "super-user", "super-admin", "admin"],
                        "icon": Box,
                        "items": []
                    }
                ]
            }

        ]
    },
    {
        "name": "Users",
        "subMenuItems": [
            {
                "title": "Users",
                "url": "#Users",
                "canAccess": ["owner", "super-user", "super-admin", "admin"],
                "icon": UserRound,
                "items": [
                    {
                        "title": "Users",
                        "url": "#Users Logs",
                        "canAccess": ["owner", "super-user", "super-admin", "admin"],
                        "icon": Box,
                        "items": []
                    }
                ]
            },
            {
                "title": "Super users",
                "url": "#Super users",
                "canAccess": ["owner", "super-user", "super-admin", "admin"],
                "icon": UserRound,
                "items": [
                    {
                        "title": "Super users",
                        "url": "#Super users",
                        "canAccess": ["owner", "super-user", "super-admin", "admin"],
                        "icon": Box,
                        "items": []
                    }
                ]
            },
            {
                "title": "Content Admin",
                "url": "#Content Admin",
                "canAccess": ["owner", "super-admin", "admin"],
                "icon": UserRound,
                "items": [
                    {
                        "title": "Content Admin",
                        "url": "#Content Admin",
                        "canAccess": ["owner", "super-admin", "admin"],
                        "icon": Box,
                        "items": []
                    }
                ]
            },
            {
                "title": "Admins",
                "url": "#Admins",
                "canAccess": ["owner", "super-admin", "admin"],
                "icon": UserRound,
                "items": [
                    {
                        "title": "Admins",
                        "url": "#Admins",
                        "canAccess": ["owner", "super-admin", "admin"],
                        "icon": Box,
                        "items": []
                    }
                ]
            },
            {
                "title": "Super Admins",
                "url": "#Super Admins",
                "canAccess": ["owner", "super-admin",],
                "icon": UserRound,
                "items": [
                    {
                        "title": "Super Admins",
                        "url": "#Super Admins",
                        "canAccess": ["owner", "super-admin",],
                        "icon": Box,
                        "items": []
                    }
                ]
            },
            {
                "title": "Owner",
                "url": "#Owner",
                "canAccess": ["owner"],
                "icon": UserRound,
                "items": [
                    {
                        "title": "Owner",
                        "url": "#Owner",
                        "canAccess": ["owner"],
                        "icon": Box,
                        "items": []
                    }
                ]
            }
        ]
    },
    {
        "name": "User Data",
        "subMenuItems": [
            {
                "title": "Medication Reordering",
                "url": "#Medication Reordering",
                "canAccess": ["owner", "super-admin", "admin"],
                "icon": Pill,
                "items": [
                    {
                        "title": "Medication Reordering",
                        "url": "#Medication Reordering",
                        "canAccess": ["owner", "super-admin", "admin"],
                        "icon": Box,
                        "items": []
                    }
                ]
            },
            {
                "title": "Asthma Check-in Surveys",
                "url": "#Asthma Check-in Surveys",
                "canAccess": ["owner", "super-admin", "admin"],
                "icon": PillBottle,
                "items": [
                    {
                        "title": "Asthma Check-in Surveys",
                        "url": "#Asthma Check-in Surveys",
                        "canAccess": ["owner", "super-admin", "admin"],
                        "icon": Box,
                        "items": []
                    }
                ]
            },
            {
                "title": "User Feedback Surveys ",
                "url": "#User Feedback Surveys ",
                "canAccess": ["owner", "super-admin", "admin"],
                "icon": MessageCircleMore,
                "items": [
                    {
                        "title": "User Feedback Surveys ",
                        "url": "#User Feedback Surveys ",
                        "canAccess": ["owner", "super-admin", "admin"],
                        "icon": Box,
                        "items": []
                    }
                ]
            }
        ]
    },
    {
        "name": "Legal",
        "subMenuItems": [
            {
                "title": "Privacy Policy",
                "url": "#Privacy Policy",
                "canAccess": ["owner", "super-admin", "admin"],
                "icon": Shield,
                "items": [
                    {
                        "title": "Privacy Policy",
                        "url": "#Privacy Policy",
                        "canAccess": ["owner", "super-admin", "admin"],
                        "icon": Box,
                        "items": []
                    }
                ]
            },
            {
                "title": "Terms & Conditions",
                "url": "#Terms & Conditions",
                "canAccess": ["owner", "super-admin", "admin"],
                "icon": FileText,
                "items": [
                    {
                        "title": "Terms & Conditions",
                        "url": "#Terms & Conditions",
                        "canAccess": ["owner", "super-admin", "admin"],
                        "icon": Box,
                        "items": []
                    }
                ]
            }
        ]
    }
]
export default sideBarGroups