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
    WalletCards,
    Youtube
} from "lucide-react";
import NHS from "@/nhs.svg"
import Building from "@/building.svg";
import OnBoarding from "@/onboarding.svg";

export interface Group {
    name: string;
    icon: React.ElementType;
    subMenuItems: subMenuItem[];
}
export interface subMenuItem {
    title: string;
    url?: string;
    canAccess: string[];
    icon: LucideIcon;
    items: subMenuItem[];
}
const sideBarGroups: Group[] = [
    {
        "name": "CMS",
        "icon": FileText,
        "subMenuItems": [
            {
                "title": "Articles",
                "url": "/articles",
                "canAccess": ["owner", "content-admin", "super-admin", "superuser", "admin"],
                "icon": FileText,
                "items": []
            },
            {
                "title": "Videos",
                "url": "/videos",
                "canAccess": ["owner", "content-admin", "super-admin", "superuser", "admin"],
                "icon": Youtube,
                "items": []
            },
            {
                "title": "Animations",
                "url": "#Animations",
                "canAccess": ["owner", "content-admin", "super-admin", "superuser", "admin"],
                "icon": FileVideo,
                "items": []
            },
            {
                "title": "Quiz",
                "url": "/quiz",
                "canAccess": ["owner", "content-admin", "super-admin", "superuser", "admin"],
                "icon": CircleHelp,
                "items": []
            },
            {
                "title": "Tips",
                "url": "/tips",
                "canAccess": ["owner", "content-admin", "super-admin", "superuser", "admin"],
                "icon": InfoIcon,
                "items": []
            },

            {
                "title": "NHS Content ",
                "canAccess": ["owner", "content-admin", "super-admin", "superuser", "admin"],
                "icon": NHS,
                "items": [
                    {
                        "title": "Medicines A-Z",
                        "url": "/medicines",
                        "canAccess": ["owner", "content-admin", "super-admin", "superuser", "admin"],
                        "icon": FolderClosed,
                        "items": []
                    },
                    {
                        "title": "Health A-Z",
                        "url": "/conditions",
                        "canAccess": ["owner", "content-admin", "super-admin", "superuser", "admin"],
                        "icon": FolderClosed,
                        "items": []
                    }
                ]
            },
            {
                "title": "Content Categories",
                "canAccess": ["owner", "content-admin", "super-admin", "superuser", "admin"],
                "icon": FolderClosed,
                "items": [
                    {
                        "title": "Sections",
                        "url": "/sections",
                        "canAccess": ["owner", "content-admin", "super-admin", "superuser", "admin"],
                        "icon": FolderClosed,
                        "items": []
                    },
                    {
                        "title": "Subsections",
                        "url": "/sub-sections",
                        "canAccess": ["owner", "content-admin", "super-admin", "superuser", "admin"],
                        "icon": BookmarkMinus,
                        "items": []
                    },
                    {
                        "title": "Collections",
                        "url": "/collections",
                        "canAccess": ["owner", "content-admin", "super-admin", "superuser", "admin"],
                        "icon": Box,
                        "items": []
                    },
                    {
                        "title": "Packs",
                        "url": "/packs",
                        "canAccess": ["owner", "content-admin", "super-admin", "superuser", "admin"],
                        "icon": WalletCards,
                        "items": []
                    },
                ]
            },

            {
                "title": "Surveys",
                "url": "#Surveys",
                "canAccess": ["owner", "content-admin", "super-admin", "superuser", "admin"],
                "icon": FileSignature,
                "items": [
                    {
                        "title": "Survey S1",
                        "url": "#Survey S1",
                        "canAccess": ["owner", "content-admin", "super-admin", "superuser", "admin"],
                        "icon": Box,
                        "items": [
                            {
                                "title": "Survey S1",
                                "url": "#Survey S1",
                                "canAccess": ["owner", "content-admin", "super-admin", "superuser", "admin"],
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
                "canAccess": ["owner", "content-admin", "super-admin", "superuser", "admin"],
                "icon": Building,
                "items": []
            },
            {
                "title": "Onboarding Flow",
                "url": "/onboarding-flow",
                "canAccess": ["owner", "content-admin", "super-admin", "superuser", "admin"],
                "icon": OnBoarding,
                "items": []
            },
            {
                "title": "Journey",
                "url": "/journey",
                "canAccess": ["owner", "content-admin", "super-admin", "superuser", "admin"],
                "icon": MapPinned,
                "items": []
            },
            {
                "title": "Health Tracker ",
                "url": "#Health Tracker ",
                "canAccess": ["owner", "content-admin", "super-admin", "superuser", "admin"],
                "icon": HeartPulse,
                "items": []
            }
        ]
    },
    {
        "name": "Analytics",
        "icon": BarChart4,
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
        "icon": ClipboardCheck,
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
        "icon": Package,
        "subMenuItems": [
            {
                "title": "Version Update ",
                "url": "#Version Update ",
                "canAccess": ["owner", "superuser", "super-admin", "admin"],
                "icon": Package,
                "items": [
                    {
                        "title": "Version Update ",
                        "url": "#Version Update",
                        "canAccess": ["owner", "superuser", "super-admin", "admin"],
                        "icon": Box,
                        "items": []
                    }
                ]
            },
            {
                "title": "Maintenance Mode",
                "url": "#Maintenance Mode",
                "canAccess": ["owner", "superuser", "super-admin", "admin"],
                "icon": FolderCog,
                "items": [
                    {
                        "title": "Maintenance Mode",
                        "url": "#Maintenance Mode",
                        "canAccess": ["owner", "superuser", "super-admin", "admin"],
                        "icon": Box,
                        "items": []
                    }
                ]
            },
            {
                "title": "Settings ",
                "url": "#Settings ",
                "canAccess": ["owner", "superuser", "super-admin", "admin"],
                "icon": Settings,
                "items": [
                    {
                        "title": "Settings ",
                        "url": "#Settings",
                        "canAccess": ["owner", "superuser", "super-admin", "admin"],
                        "icon": Box,
                        "items": []
                    }
                ]
            },
            {
                "title": "Changelog",
                "url": "#Changelog",
                "canAccess": ["owner", "superuser", "super-admin", "admin"],
                "icon": FileCog,
                "items": [
                    {
                        "title": "Changelog",
                        "url": "#Changelog",
                        "canAccess": ["owner", "superuser", "super-admin", "admin"],
                        "icon": Box,
                        "items": []
                    }
                ]
            },
            {
                "title": "Schema",
                "url": "#Schema",
                "canAccess": ["owner", "superuser", "super-admin", "admin"],
                "icon": Network,
                "items": [
                    {
                        "title": "Schema",
                        "url": "#Schema",
                        "canAccess": ["owner", "superuser", "super-admin", "admin"],
                        "icon": Box,
                        "items": []
                    }
                ]
            },
            {
                "title": "Push Notifications ",
                "url": "#Push Notifications ",
                "canAccess": ["owner", "superuser", "super-admin", "admin"],
                "icon": BellRing,
                "items": [
                    {
                        "title": "Push Notifications ",
                        "url": "#CRON Logs",
                        "canAccess": ["owner", "superuser", "super-admin", "admin"],
                        "icon": Box,
                        "items": []
                    }
                ]
            },
            {
                "title": "About App ",
                "url": "#About App ",
                "canAccess": ["owner", "superuser", "super-admin", "admin"],
                "icon": CircleAlert,
                "items": [
                    {
                        "title": "About App ",
                        "url": "#About App",
                        "canAccess": ["owner", "superuser", "super-admin", "admin"],
                        "icon": Box,
                        "items": []
                    }
                ]
            },
            {
                "title": "Support ",
                "url": "#Support ",
                "canAccess": ["owner", "superuser", "super-admin", "admin"],
                "icon": MessageSquareMore,
                "items": [
                    {
                        "title": "Support ",
                        "url": "#CRON Logs",
                        "canAccess": ["owner", "superuser", "super-admin", "admin"],
                        "icon": Box,
                        "items": []
                    }
                ]
            }

        ]
    },
    {
        "name": "Users",
        "icon": UserRound,
        "subMenuItems": [
            {
                "title": "Users",
                "url": "#Users",
                "canAccess": ["owner", "superuser", "super-admin", "admin"],
                "icon": UserRound,
                "items": [
                    {
                        "title": "Users",
                        "url": "#Users Logs",
                        "canAccess": ["owner", "superuser", "super-admin", "admin"],
                        "icon": Box,
                        "items": []
                    }
                ]
            },
            {
                "title": "Super users",
                "url": "#Super users",
                "canAccess": ["owner", "superuser", "super-admin", "admin"],
                "icon": UserRound,
                "items": [
                    {
                        "title": "Super users",
                        "url": "#Super users",
                        "canAccess": ["owner", "superuser", "super-admin", "admin"],
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
        "icon": Pill,
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
        "icon": Shield,
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