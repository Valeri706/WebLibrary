import React, {FC, ReactNode} from "react";
import {ModalBody, ModalFooter, ModalHeader} from "@nextui-org/modal";
import {Button} from "@nextui-org/button";

interface IConfirmModalProps {
    header: string;
    body: ReactNode;
    onConfirm: () => void;
    onDismiss: () => void;
    confirmButtonText?: string;
    dismissButtonText?: string;
}
export const ConfirmModal: FC<IConfirmModalProps> = (
    {header, body, onConfirm, onDismiss, dismissButtonText, confirmButtonText
    }) => {
    return (
        <>
            <ModalHeader className="flex flex-col gap-1">{header}</ModalHeader>
            <ModalBody>
                {body}
            </ModalBody>
            <ModalFooter>
                <Button color="danger" onPress={onDismiss}>
                    {dismissButtonText ?? "Ні"}
                </Button>
                <Button color="primary" variant="light" onPress={onConfirm}>
                    {confirmButtonText ?? "Так"}
                </Button>
            </ModalFooter>
        </>
    )
}
