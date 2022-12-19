import {
    Flex,
    FormControl,
    FormErrorMessage,
    FormLabel,
    IconButton,
    Input,
    Textarea,
} from '@chakra-ui/react';
import { useField } from 'formik';
import { FC, InputHTMLAttributes, useState } from 'react';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { ACCENT_COLOR, ACCENT_COLOR_LIGHT } from '../styles/consts';

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
    name: string;
    label: string;
    isPassword: boolean;
    showFormLabel: boolean;
    textArea?: boolean;
};

const InputField: FC<InputFieldProps> = ({
    label,
    showFormLabel,
    size: _,
    ...props
}) => {
    let InputOrTextArea = Input;
    if (props.textArea) {
        //@ts-ignore
        InputOrTextArea = Textarea;
    }
    const [field, { error }] = useField(props);
    const [showPassword, setShowPassword] = useState(false);

    return (
        <FormControl isInvalid={!!error}>
            {showFormLabel ? (
                <FormLabel htmlFor='name' color={ACCENT_COLOR_LIGHT}>
                    {label}
                </FormLabel>
            ) : null}
            <Flex>
                <InputOrTextArea
                    {...field}
                    {...props}
                    id={field.name}
                    _placeholder={{ color: 'gray.200' }}
                    placeholder={props.placeholder}
                    type={showPassword ? 'text' : props.type}
                    focusBorderColor={ACCENT_COLOR}
                />

                {props.isPassword && (
                    <IconButton
                        zIndex={1}
                        position={'absolute'}
                        right={0}
                        variant={'unstyled'}
                        size={'md'}
                        color={ACCENT_COLOR_LIGHT}
                        aria-label={'hide/show password'}
                        icon={
                            showPassword ? (
                                <AiFillEyeInvisible />
                            ) : (
                                <AiFillEye />
                            )
                        }
                        onClick={() => setShowPassword((prev) => !prev)}
                    />
                )}
            </Flex>
            {error && <FormErrorMessage>{error}</FormErrorMessage>}
        </FormControl>
    );
};

export default InputField;
