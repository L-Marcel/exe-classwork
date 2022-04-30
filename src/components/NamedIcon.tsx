import { Icon as ChakraIcon, IconProps as ChakraIconProps } from "@chakra-ui/react";
import { AiFillCaretDown, AiFillCaretUp, AiFillHtml5, AiOutlineCalendar, AiOutlineCheck, AiOutlineClose, AiOutlineInfoCircle, AiOutlineMenu, AiOutlineNumber, AiOutlinePlus, AiOutlinePoweroff, AiOutlineRight } from "react-icons/ai";
import { BiCubeAlt, BiSearchAlt } from "react-icons/bi";
import { BsDownload, BsFillJournalBookmarkFill, BsFillMoonStarsFill, BsQuestionCircle } from "react-icons/bs";
import { CgTikcode } from "react-icons/cg";
import { DiCss3, DiSass } from "react-icons/di";
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaAngleLeft, FaAngleRight, FaBalanceScale, FaBell, FaChalkboardTeacher, FaDocker, FaGitAlt, FaGithubAlt, FaHome, FaJava, FaPencilAlt, FaPython, FaReact, FaSun, FaUser } from "react-icons/fa";
import { FiCopy, FiFigma, FiFramer, FiPaperclip } from "react-icons/fi";
import { GrGraphQl, GrNode } from "react-icons/gr";
import { IoIosRocket, IoLogoJavascript, IoMdOpen, IoMdSchool } from "react-icons/io";
import { RiFilePaper2Line, RiFlashlightFill, RiFlutterFill, RiGitRepositoryLine } from "react-icons/ri";
import { SiApachekafka, SiApollographql, SiChakraui, SiDart, SiExpress, SiGnubash, SiJest, SiNestjs, SiNextdotjs, SiPrisma, SiTailwindcss, SiTypescript, SiVisualstudiocode } from "react-icons/si";
import { TiGroup } from "react-icons/ti";
interface IconProps extends ChakraIconProps {
  name?: string;
};

export const icons = {
  "react.js": FaReact,
  "node.js": GrNode,
  "typescript": SiTypescript,
  "next.js": SiNextdotjs,
  "react native": FaReact,
  "html": AiFillHtml5,
  "css": DiCss3,
  "sass": DiSass,
  "javascript": IoLogoJavascript,
  "docker": FaDocker,
  "flutter": RiFlutterFill,
  "java": FaJava,
  "git": FaGitAlt,
  "python": FaPython,
  "github": FaGithubAlt,
  "bash": SiGnubash,
  "default": BsQuestionCircle,
  "calendar": AiOutlineCalendar,
  "check": AiOutlineCheck,
  "figma": FiFigma,
  "self": FiPaperclip,
  "school": IoMdSchool,
  "documentation": RiFilePaper2Line,
  "search": BiSearchAlt,
  "rocketseat": IoIosRocket,
  "copy": FiCopy,
  "network": BiCubeAlt,
  "license": FaBalanceScale,
  "open": IoMdOpen,
  "download": BsDownload,
  "dart": SiDart,
  "sun": FaSun,
  "moon": BsFillMoonStarsFill,
  "article": FiPaperclip,
  "flash": RiFlashlightFill,
  "framer motion": FiFramer,
  "prisma": SiPrisma,
  "vscode": SiVisualstudiocode,
  "chakraui": SiChakraui,
  "jest": SiJest,
  "express": SiExpress,
  "graphql": GrGraphQl,
  "kafka": SiApachekafka,
  "apollo": SiApollographql,
  "tailwind": SiTailwindcss,
  "nest.js": SiNestjs,
  "down": AiFillCaretDown,
  "up": AiFillCaretUp,
  "close": AiOutlineClose,
  "info": AiOutlineInfoCircle,
  "user": FaUser,
  "home": FaHome,
  "classrooms": FaChalkboardTeacher,
  "alerts": FaBell,
  "repositories": RiGitRepositoryLine,
  "teams": TiGroup,
  "menu": AiOutlineMenu,
  "add": AiOutlinePlus,
  "submit": AiOutlineRight,
  "qrcode": CgTikcode,
  "pencil": FaPencilAlt,
  "subject": BsFillJournalBookmarkFill,
  "exit": AiOutlinePoweroff,
  "double-prev": FaAngleDoubleLeft,
  "prev": FaAngleLeft,
  "double-next": FaAngleDoubleRight,
  "next": FaAngleRight,
  "number": AiOutlineNumber
};

function NamedIcon({ name = "default", ...rest }: IconProps) {
  const _name = name.toLowerCase();
  const icon = icons[_name] ?? icons["default"];
  return (
    <ChakraIcon
      data-testid="icon"
      as={icon}
      {...rest}
    />
  );
};

export { NamedIcon };

