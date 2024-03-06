import { useEffect, useState } from "react";
import { Button, Grid, Header } from "semantic-ui-react";
import PhotoWidgetDropzone from "./PhotoWidgetDropzone";
import PhotoWidgetCropper from "./PhotoWidgetCropper";

interface Props {
    loading: boolean;
    uploadPhoto: (file: Blob) => void;
}

export default function PhotoUploadWidget({ loading, uploadPhoto }: Props) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [files, setFiles] = useState<any>([]);
    const [cropper, setCropper] = useState<Cropper>();

    function onCrop() {
        if (cropper) {
            cropper.getCroppedCanvas().toBlob((blob) => uploadPhoto(blob!));
        }
    }

    useEffect(() => {
        return () => {
            files.forEach((file: object & { preview: string }) => URL.revokeObjectURL(file.preview));
        };
    }, [files]);

    return (
        <Grid stackable className="photo-upload">
            <Grid.Column style={{ maxWidth: '33.3333%',width: '33.3333%' }}>
                <Header color="teal" sub content="Стъпка 1 - Добави снимка" />
                <PhotoWidgetDropzone setFiles={setFiles} />
            </Grid.Column>
            <Grid.Column style={{ maxWidth: '33.3333%',width: '33.3333%' }}>
                <Header color="teal" sub content="Стъпка 2 - Изрежи" />
                {files && files.length > 0 && (
                    <PhotoWidgetCropper setCropper={setCropper} imagePreview={files[0].preview} />
                )}
            </Grid.Column>
            <Grid.Column style={{ maxWidth: '33.3333%',width: '33.3333%' }}>
                <Header color="teal" sub content="Стъпка 3 - Преглед" />
                {files && files.length > 0 && (
                    <>
                        <div className="img-preview" style={{ minHeight: 200, overflow: 'hidden' }} />
                        <Button.Group widths={2} style={{ maxWidth: '200px', marginTop: "10px"}}>
                            <Button loading={loading} onClick={onCrop} positive icon="check" />
                            <Button disabled={loading} onClick={() => setFiles([])} icon="close" />
                        </Button.Group>
                    </>
                )}
            </Grid.Column>
        </Grid>
    );
}
