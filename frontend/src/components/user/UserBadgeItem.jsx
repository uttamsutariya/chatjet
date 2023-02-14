import { CloseIcon } from "@chakra-ui/icons";
import { Badge } from "@chakra-ui/layout";

const UserBadgeItem = ({ user, handleFunction, admin, showCloseBtn }) => {
	return (
		<Badge
			px={2}
			py={1}
			borderRadius="lg"
			m={1}
			mb={2}
			variant="outline"
			fontSize={12}
			colorScheme="facebook"
			cursor="pointer"
			onClick={handleFunction}
		>
			{user?.name}
			{admin?._id == user?._id && <span> (Admin)</span>}
			{showCloseBtn ? <CloseIcon pl={1} /> : null}
		</Badge>
	);
};

export default UserBadgeItem;
