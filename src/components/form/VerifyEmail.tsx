import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Field, FieldGroup } from '../ui/field';
import { useForm } from '@tanstack/react-form';

const VerifyEmail = () => {
    const form = useForm({
        defaultValues:{
            
        }
    })
    return (
        <div>
            <Card>
                <CardContent className="">
                        <form>
                            <FieldGroup>
                                <Field>


                                </Field>
                            </FieldGroup>
                        </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default VerifyEmail;