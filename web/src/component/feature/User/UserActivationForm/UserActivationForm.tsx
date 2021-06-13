import type UserActivationFormProps from "./UserActivationForm.type";

const UserActivationForm = ({ className, user }: UserActivationFormProps) => {
  return <div className={className}>{JSON.stringify(user)}</div>;
};

export default UserActivationForm;
