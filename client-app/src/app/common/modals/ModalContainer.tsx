import { observer } from "mobx-react-lite";
import { Modal } from "semantic-ui-react";
import { useStore } from "../../stores/store";

export default observer(function ModalContainer() {
  const { modalStore, partnerStore } = useStore();

  return (
    <>
      {modalStore.modals.length > 0 ? (
        modalStore.modals.map((modal) => (
          <Modal
            closeIcon
            key={modal.id}
            open={modal.open}
            onClose={() => {
              modalStore.closeModals(modal.id!);
              if (modal.id === ' partnerDetailsModal') { partnerStore.clearSelectedPartner(); }
            }}
            size={modal.size}
            closeOnDimmerClick={false}
          >
            <Modal.Content style={{ maxHeight: "93vh" }} scrolling>{modal.body}</Modal.Content>
          </Modal>
        ))
      ) : (
        <Modal
          open={modalStore.modal.open}
          onClose={modalStore.closeModal}
          size={modalStore.modal.size}
          closeOnDimmerClick={false}
        >
          <Modal.Content>{modalStore.modal.body}</Modal.Content>
        </Modal>
      )}
    </>
  );
});