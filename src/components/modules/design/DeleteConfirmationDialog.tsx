import React, { Component } from 'react';
import { StyleClass, css } from '../../../utils/Style';
import { Classes, Button } from '@blueprintjs/core';

interface IDeleteConfirmationDialogProps {
  onDeleteClick: () => void;
}

const dialogStyle = new StyleClass(css`
  padding: 1em;
  padding-top: 0.1em;
`);
const cancelButtonStyle = new StyleClass(css`
  margin-right: 0.5em;
`);

class DeleteConfirmationDialog extends Component<
  IDeleteConfirmationDialogProps
> {
  public constructor(props: Readonly<IDeleteConfirmationDialogProps>) {
    super(props);

    this.handleDeleteClick = this.handleDeleteClick.bind(this);
  }

  public render() {
    return (
      <div className={dialogStyle.className}>
        <h4>Remove this item?</h4>
        <div>
          <Button
            className={`${cancelButtonStyle.className} ${Classes.POPOVER_DISMISS}`}
          >
            Cancel
          </Button>
          <Button
            className={Classes.POPOVER_DISMISS}
            intent="danger"
            onClick={this.handleDeleteClick}
          >
            Delete
          </Button>
        </div>
      </div>
    );
  }

  private handleDeleteClick() {
    if (this.props.onDeleteClick) {
      this.props.onDeleteClick();
    }
  }
}

export default DeleteConfirmationDialog;
