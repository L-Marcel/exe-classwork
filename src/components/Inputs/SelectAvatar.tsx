import { AvatarGroup, Box, BoxProps } from "@chakra-ui/react";
import { useState } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { AvatarItem } from "../List/Avatar/AvatarItem";

interface SelectAvatarProps extends BoxProps {
  register: UseFormRegisterReturn;
  users: TeamRelation[];
};

function SelectAvatar({
  register,
  users,
  ...rest
}: SelectAvatarProps) {
  const [hover, setHover] = useState(false);

  function handleChangeSelectedAvatar(userId: string) {
    let items = users;

    items = items.map(u => {
      return { 
        ...u, 
        role: "MEMBER" 
      } as TeamRelation;
    });

    const index = items.findIndex(u => u.user.id === userId);

    items[index].role = "LEADER";

    const ev = { target: { 
      value: items,
      name: register?.name
    }};

    register?.onChange(ev);
  };

  return (
    <Box
      {...rest}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <AvatarGroup
        size="md"
        max={hover? Infinity:9}
        w={[300, 350, 500]}
        display="flex"
        flexWrap="nowrap"
      >
        {users?.map(u => {
          return (
            <AvatarItem
              key={u.user?.id}
              user={u.user}
              onSelect={(user) => handleChangeSelectedAvatar(user.id)}
              isSelected={u.role === "LEADER"}
            />
          );
        })}
        {users?.map(u => {
          return (
            <AvatarItem
              key={u.user?.id}
              user={u.user}
            />
          );
        })}
        {users?.map(u => {
          return (
            <AvatarItem
              key={u.user?.id}
              user={u.user}
            />
          );
        })}
        {users?.map(u => {
          return (
            <AvatarItem
              key={u.user?.id}
              user={u.user}
            />
          );
        })}
        {users?.map(u => {
          return (
            <AvatarItem
              key={u.user?.id}
              user={u.user}
            />
          );
        })}
        {users?.map(u => {
          return (
            <AvatarItem
              key={u.user?.id}
              user={u.user}
            />
          );
        })}
      </AvatarGroup>
    </Box>
  );
};

export { SelectAvatar };

