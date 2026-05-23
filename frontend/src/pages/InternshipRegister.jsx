// Common components
import ServerErrorsDisplay from '../components/common/ServerErrorsDisplay';

// Form components
import RegistrationForm from '../components/form/RegistrationForm';

// Other components
import AnimatedRegistrationCounter from '../components/common/AnimatedRegistrationCounter';

const InternshipRegister = () => {
    return (
        <div>
            {/* <AnimatedRegistrationCounter /> */}
            <RegistrationForm />
        </div>
    );
};

export default InternshipRegister;