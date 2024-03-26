import { observer } from "mobx-react-lite";
import { Grid } from "semantic-ui-react";
import MyTextInput from "../../../app/common/form/MyTextInput";

interface Props {
    isSupplier: boolean;
    isClient: boolean;
}

export default observer(function PartnerCreate({ isClient }: Props) {


    return (
        <Grid columns={3} className="partner-create_company-info-fields">
            <Grid.Row className="company-info-fields">
                <Grid.Column>
                    <MyTextInput label="Име на фирма" name='createCompanyDto.name' placeholder='Име на фирма' />
                </Grid.Column>
                <Grid.Column>
                    <MyTextInput label="Булстат" name='createCompanyDto.bulstat' placeholder='Булстат' />
                </Grid.Column>
                <Grid.Column>
                    <MyTextInput label="Телефон" name='createCompanyDto.phone' placeholder='Телефон' />
                </Grid.Column>
            </Grid.Row>
            <Grid.Row className="company-info-fields">
                <Grid.Column>
                    <MyTextInput label="Имейл" name='createCompanyDto.email' placeholder='Имейл' />
                </Grid.Column>
                <Grid.Column>
                    <MyTextInput label="Град" name='createCompanyDto.city' placeholder='Град' />
                </Grid.Column>
                <Grid.Column>
                    <MyTextInput label="Адрес" name='createCompanyDto.address' placeholder='Адрес' />
                </Grid.Column>
            </Grid.Row>
            <Grid.Row className="company-info-fields">
                <Grid.Column>
                    <MyTextInput label="МОЛ" name='createCompanyDto.companyOwnerName' placeholder='Име на собственик' />
                </Grid.Column>
                {
                    isClient && (
                        <>
                            <Grid.Column>
                                <MyTextInput label="Тел. за доставка" name='phone' placeholder='Тел. за доставка' />
                            </Grid.Column>
                            <Grid.Column>
                                <MyTextInput label="Имейл" name='email' placeholder='Имейл' />
                            </Grid.Column>
                        </>
                    )
                }
            </Grid.Row>

        </Grid>
    )
});