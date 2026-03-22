import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { Modal } from "semantic-ui-react";
import { useStore } from "../../stores/store";

export default observer(function ModalContainer() {
  const { modalStore, partnerStore } = useStore();
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        partnerStore.clearSelectedPartner();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [partnerStore]);

  return (
    <>
      {modalStore.modals.length > 0 ? (
        modalStore.modals.map((modal) => (
          <Modal
            closeIcon={{
              name: 'close', onClick: () => {
                if (modal.id === 'partnerDetailsModal') {
                  partnerStore.clearSelectedPartner()
                }
              }
            }}
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
          closeIcon={{ name: 'close', onClick: () => partnerStore.clearSelectedPartner() }}
        >
          <Modal.Content>{modalStore.modal.body}</Modal.Content>
        </Modal>
      )}
    </>
  );
});