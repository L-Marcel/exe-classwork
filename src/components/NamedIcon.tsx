import { Icon as ChakraIcon, IconProps as ChakraIconProps } from "@chakra-ui/react";
import { AiFillCaretDown, AiFillCaretUp, AiFillHtml5, AiFillStar, AiOutlineCalendar, AiOutlineCheck, AiOutlineClose, AiOutlineInfoCircle, AiOutlineMenu, AiOutlineNumber, AiOutlinePaperClip, AiOutlinePlus, AiOutlinePoweroff, AiOutlineReload, AiOutlineRight, AiOutlineStar } from "react-icons/ai";
import { BiCog, BiCrown, BiCubeAlt, BiLike, BiSearchAlt } from "react-icons/bi";
import { BsCloudSun, BsDownload, BsEmojiExpressionless, BsEmojiSunglasses, BsFillJournalBookmarkFill, BsFillMoonStarsFill, BsFillQuestionCircleFill, BsHourglassSplit, BsMoonStars, BsNewspaper, BsQuestionCircle, BsSunrise } from "react-icons/bs";
import { CgTikcode } from "react-icons/cg";
import { DiCss3, DiSass } from "react-icons/di";
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaAngleLeft, FaAngleRight, FaBalanceScale, FaBell, FaChalkboardTeacher, FaDocker, FaGitAlt, FaGithubAlt, FaHandsHelping, FaHome, FaJava, FaPencilAlt, FaProjectDiagram, FaPython, FaReact, FaRegPaperPlane, FaRegSave, FaSun, FaUser } from "react-icons/fa";
import { FiCopy, FiFigma, FiFramer, FiPaperclip } from "react-icons/fi";
import { GiSwordWound } from "react-icons/gi";
import { GrGraphQl, GrNode } from "react-icons/gr";
import { IoIosRocket, IoLogoJavascript, IoMdAddCircleOutline, IoMdOpen, IoMdRemoveCircleOutline, IoMdSchool } from "react-icons/io";
import { MdOutlineEmojiObjects, MdOutlineTune, MdOutlineUpdate } from "react-icons/md";
import { RiFilePaper2Line, RiFlashlightFill, RiFlutterFill, RiGitRepositoryLine, RiListCheck2, RiZzzFill } from "react-icons/ri";
import { SiApachekafka, SiApollographql, SiChakraui, SiDart, SiExpress, SiGnubash, SiJest, SiNestjs, SiNextdotjs, SiPrisma, SiTailwindcss, SiTypescript, SiVisualstudiocode } from "react-icons/si";
import { TiGroup, TiWarningOutline } from "react-icons/ti";
import { VscSymbolClass, VscSymbolMethod } from "react-icons/vsc";
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
  "alt-moon": BsMoonStars,
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
  "number": AiOutlineNumber,
  "list": RiListCheck2,
  "leader": AiFillStar,
  "not-leader": AiOutlineStar,
  "cog": BiCog,
  "refresh": AiOutlineReload,
  "project": FaProjectDiagram,
  "helping": FaHandsHelping,
  "sunrise": BsSunrise,
  "like": BiLike,
  "sunglasses": BsEmojiSunglasses,
  "sword": GiSwordWound,
  "newspaper": BsNewspaper,
  "clip": AiOutlinePaperClip,
  "paperplane": FaRegPaperPlane,
  "warning": TiWarningOutline,
  "add-circle": IoMdAddCircleOutline,
  "remove-circle": IoMdRemoveCircleOutline,
  "afternoon": BsCloudSun,
  "crown": BiCrown,
  "frequency": MdOutlineUpdate,
  "hourglass": BsHourglassSplit,
  "slepping": RiZzzFill,
  "hater": BsEmojiExpressionless,
  "floppy-disk": FaRegSave,
  "methods-icon": VscSymbolMethod,
  "tune": MdOutlineTune,
  "question": BsFillQuestionCircleFill,
  "oriented": MdOutlineEmojiObjects,
  "class": VscSymbolClass
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

