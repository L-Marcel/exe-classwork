import { Icon as ChakraIcon, IconProps as ChakraIconProps } from "@chakra-ui/react";
import { 
  FaReact, FaDocker, FaGitAlt, 
  FaJava, FaPython, FaBalanceScale, FaGithubAlt, FaSun, FaUser, FaHome, FaChalkboardTeacher, FaBell
} from "react-icons/fa";
import { 
  SiTypescript, SiJest, SiNextdotjs, SiGnubash, 
  SiDart, SiPrisma, SiVisualstudiocode, SiChakraui, SiExpress, SiApachekafka, 
  SiTailwindcss, SiApollographql, SiNestjs
} from "react-icons/si";
import { DiCss3, DiSass } from "react-icons/di";
import { AiFillHtml5, AiFillCaretDown, AiOutlineInfoCircle, AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { RiFlutterFill, RiFilePaper2Line, RiFlashlightFill, RiGitRepositoryLine } from "react-icons/ri";
import { BsDownload, BsFillMoonStarsFill, BsQuestionCircle } from "react-icons/bs";
import { 
  AiOutlineCalendar, AiOutlineCheck, AiFillCaretUp
} from "react-icons/ai";
import { IoIosCloseCircle, IoIosRocket, IoLogoJavascript, IoMdOpen, IoMdSchool } from "react-icons/io";
import { FiCopy, FiFigma, FiFramer, FiPaperclip } from "react-icons/fi";
import { GrNode, GrGraphQl } from "react-icons/gr";
import { BiCubeAlt, BiSearchAlt } from "react-icons/bi";
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
  "menu": AiOutlineMenu
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