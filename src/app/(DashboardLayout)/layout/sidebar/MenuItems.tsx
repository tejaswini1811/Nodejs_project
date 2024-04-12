import {
  IconHome,
  IconBuildingStore,
  IconClipboardCopy,
  IconTimeline,
  IconUsersGroup,
  IconList,
  IconGiftCard,
  IconReportMedical,
  IconNotebook,
  IconWriting,
  IconGift,
  IconMessageChatbot,
} from "@tabler/icons-react";

import { uniqueId } from "lodash";

const Menuitems = [
  {
    id: uniqueId(),
    title: "Home",
    icon: IconHome,
    href: "/",
  },
  {
    id: uniqueId(),
    title: "Business Listing",
    icon: IconList,
    href: "/business-listing",
  },
  {
    id: uniqueId(),
    title: "My Businesses",
    icon: IconUsersGroup,
    href: "/mybusinesses",
  },
  {
    id: uniqueId(),
    title: "Marketplace",
    icon: IconBuildingStore,
    href: "/marketplace",
  },
  {
    id: uniqueId(),
    title: "Subscription",
    icon: IconGiftCard,
    href: "/subscription",
  },
  {
    id: uniqueId(),
    title: "Bulletins",
    icon: IconClipboardCopy,
    href: "/bulletin",
  },
  {
    id: uniqueId(),
    title: "Buy Leads",
    icon: IconTimeline,
    href: "/buyleads",
  },
  {
    id: uniqueId(),
    title: "My Rfqs",
    icon: IconUsersGroup,
    href: "/rfqs",
  },
  {
    id: uniqueId(),
    title: "My Quotes",
    icon: IconNotebook,
    href: "/quotes",
  },
  {
    id: uniqueId(),
    title: "Agri Doctor",
    icon: IconReportMedical,
    href: "/agri-doctor",
  },
  {
    id: uniqueId(),
    title: "Reviews",
    icon: IconWriting,
    href: "/reviews",
  },
  {
    id: uniqueId(),
    title: "Refer & Earn",
    icon: IconGift,
    href: "/refer-earn",
  },
  {
    id: uniqueId(),
    title: "ChatBot",
    icon: IconMessageChatbot,
    href: "/chatbot",
  },
];

export default Menuitems;
