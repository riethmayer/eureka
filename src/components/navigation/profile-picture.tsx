import Image from "next/image";

interface ProfilePictureProps {
  imageUrl?: string;
}

/**
 * Profile Picture
 * Not sure whether we want to use authentication again, we could also just allow setting a name for the user, instead.
 */
const ProfilePicture = ({ imageUrl }: ProfilePictureProps) => {
  const placeholderSvg = (
    <svg
      className="w-12 h-12 rounded-full border-white border-2 shadow-sm hover:border-yellow-400 hover:shadow-lg shadow-black"
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="24" cy="24" r="24" fill="darkgrey" />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy=".3em"
        fontSize="12"
        fill="purple"
      >
        Login
      </text>
    </svg>
  );

  return imageUrl ? (
    <Image
      src={imageUrl}
      className="w-12 h-12 rounded-full border-white border-2 shadow-sm hover:border-yellow-400 hover:shadow-lg shadow-black"
      width={48}
      height={48}
      alt="Profile Picture"
      referrerPolicy="no-referrer"
      priority
    />
  ) : (
    placeholderSvg
  );
};

export default ProfilePicture;
